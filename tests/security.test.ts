import { describe, expect, mock, test } from 'bun:test';
import { AuthTokenService, requireTokenPurpose } from '../modules/user/src/common/services/token';
import { SessionService } from '../modules/user/src/common/services/session';
import { TelegramLinkService } from '../modules/user/src/common/services/telegramLink';
import { UserEntity } from '../modules/user/src/modules/user/entities/User';
import { UserRepository } from '../modules/user/src/modules/user/repository';
import { CashboxRepository } from '../modules/project/src/modules/cashbox/repositories/cashbox';
import { BudgetService } from '../modules/project/src/modules/budget/services';
import { CashboxSettingValuesService } from '../modules/project/src/modules/setting/services/cashbox';
import { NotFoundError } from '../src/common/errors';
import { initRedis } from '../src/common/redis';

const user = (id = 1, telegramId = '') => new UserEntity({
    id, name: 'Test', email: 'test@example.com', password: 'hash', status: 'trial',
    telegram: '', telegramId, settings: [],
});

test('Redis startup and repeated initialization preserve existing sessions', async () => {
    const entries = new Map<string, unknown>([['refresh:existing', 1], ['project:1', { title: 'Existing' }]]);
    const redis = {
        isOpen: false,
        connect: mock(async () => { redis.isOpen = true; }),
        flushAll: mock(async () => { entries.clear(); }),
    };
    await initRedis(redis as any);
    await initRedis(redis as any);
    expect(redis.connect).toHaveBeenCalledTimes(1);
    expect(redis.flushAll).not.toHaveBeenCalled();
    expect(entries.size).toBe(2);
});

describe('JWT purpose and refresh sessions', () => {
    const tokens = new AuthTokenService({ sign: (claims: unknown) => claims });

    test('access and refresh are accepted only for their own purpose', () => {
        const access = tokens.generateAccess(user());
        const refresh = tokens.generateRefresh(user(), 'session');
        expect(requireTokenPurpose(access, 'access').userId).toBe(1);
        expect(requireTokenPurpose(refresh, 'refresh').jti).toBe('session');
        expect(() => requireTokenPurpose(refresh, 'access')).toThrow();
        expect(() => requireTokenPurpose(access, 'refresh')).toThrow();
    });

    test('legacy, malformed, expired and missing-jti tokens are rejected', () => {
        const valid = tokens.generateRefresh(user(), 'session');
        for (const payload of [false, null, {}, { ...valid, token_use: undefined },
            { ...valid, sub: -1 }, { ...valid, sub: 'not-an-id' },
            { ...valid, exp: 0 }, { ...valid, jti: '' }]) {
            expect(() => requireTokenPurpose(payload, 'refresh')).toThrow();
        }
    });

    test('refresh session must belong to the token subject', async () => {
        const set = mock(async () => {});
        const service = new SessionService({ getDel: async () => 2, set } as any, tokens);
        await expect(service.refresh('session', user(1))).rejects.toThrow();
        expect(set).not.toHaveBeenCalled();
    });

    test('refresh session is consumed once', async () => {
        let owner: number | null = 1;
        const cache = {
            getDel: async () => { const value = owner; owner = null; return value; },
            set: mock(async () => {}),
        };
        const service = new SessionService(cache as any, tokens);
        await service.refresh('session', user());
        await expect(service.refresh('session', user())).rejects.toThrow();
        expect(cache.set).toHaveBeenCalledTimes(1);
    });
});

describe('Telegram linking', () => {
    function fixture() {
        let now = 0;
        const entries = new Map<string, { value: unknown; expires: number }>();
        const cache = {
            async set(key: string, value: unknown, ttl = 0) {
                entries.set(key, { value, expires: now + ttl });
            },
            async getDel<T>(key: string): Promise<T | null> {
                const entry = entries.get(key);
                entries.delete(key);
                return entry && entry.expires > now ? entry.value as T : null;
            },
        };
        const link = mock(async () => user(1, '123'));
        return { service: new TelegramLinkService(cache, { linkTelegramIfUnlinked: link }),
            link, advance: (seconds: number) => { now += seconds; } };
    }

    test('issues an opaque token and permits only one concurrent consumption', async () => {
        const { service, link } = fixture();
        const { token, expiresIn } = await service.issue(user());
        expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
        expect(expiresIn).toBe(300);
        const results = await Promise.allSettled([
            service.consume(token, '123'), service.consume(token, '123'),
        ]);
        expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
        expect(link).toHaveBeenCalledTimes(1);
        expect(link).toHaveBeenCalledWith(1, '123', undefined);
    });

    test('numeric IDs, unknown and expired tokens cannot link accounts', async () => {
        const { service, link, advance } = fixture();
        await expect(service.consume('1', '123')).rejects.toThrow();
        await expect(service.consume('a'.repeat(43), '123')).rejects.toThrow();
        const { token } = await service.issue(user());
        advance(301);
        await expect(service.consume(token, '123')).rejects.toThrow();
        expect(link).not.toHaveBeenCalled();
    });

    test('existing links cannot be replaced', async () => {
        const { service } = fixture();
        await expect(service.issue(user(1, '123'))).rejects.toThrow();
        const update = mock(async () => []);
        const repo = new UserRepository({ client: { user: { updateManyAndReturn: update } } } as any);
        expect(await repo.linkTelegramIfUnlinked(1, '456')).toBeNull();
        expect(update).toHaveBeenCalledWith({
            where: { id: 1, telegramId: null }, data: { telegramId: '456', telegram: null },
        });
    });

    test('ordinary profile updates cannot modify a Telegram identity', async () => {
        const changes = await user(1, '123').update({ name: 'Updated', telegramId: '456' } as any);
        expect(changes).not.toHaveProperty('telegramId');
        expect(changes).not.toHaveProperty('telegram');
    });

    test('a Telegram identity already owned by another account produces a conflict', async () => {
        const repo = new UserRepository({ client: { user: {
            updateManyAndReturn: async () => { throw { code: 'P2002' }; },
        } } } as any);
        await expect(repo.linkTelegramIfUnlinked(1, '123')).rejects.toMatchObject({ status: 409 });
    });
});

describe('Cashbox isolation', () => {
    const body = { amount: 100, startDate: new Date('2026-01-01'), endDate: new Date('2026-02-01') };

    function fixture() {
        const lookup = mock(async ({ id, projectId }: { id: number; projectId: number }) =>
            id === 10 && projectId === 1 ? { id, projectId } : null);
        const cashboxes = new CashboxRepository({ getFirstByFields: lookup } as any);
        const projects = { authorize: mock(async () => {}) };
        const create = mock(async () => ({ id: 1 }));
        const upsert = mock(async () => ({ value: true }));
        const cache = { del: mock(async () => {}) };
        return {
            budgets: new BudgetService({ findFirst: async () => null, create } as any, projects as any, cashboxes),
            settings: new CashboxSettingValuesService({ createOrUpdate: upsert } as any, projects as any, cache as any, cashboxes),
            create, upsert, cache, projects,
        };
    }

    test('foreign and missing cashboxes are rejected before any budget write', async () => {
        const { budgets, create } = fixture();
        for (const id of [20, 999]) {
            await expect(budgets.create(user(), body, id, 1)).rejects.toBeInstanceOf(NotFoundError);
        }
        expect(create).not.toHaveBeenCalled();
    });

    test('foreign settings are rejected before writes or cache invalidation', async () => {
        const { settings, upsert, cache } = fixture();
        await expect(settings.createOrUpdateSetting(20, user(), [{ id: 1, value: true }], 1))
            .rejects.toBeInstanceOf(NotFoundError);
        expect(upsert).not.toHaveBeenCalled();
        expect(cache.del).not.toHaveBeenCalled();
    });

    test('authorized writes to the project cashbox still succeed', async () => {
        const { budgets, settings, create, upsert } = fixture();
        await budgets.create(user(), body, 10, 1);
        await settings.createOrUpdateSetting(10, user(), [{ id: 1, value: true }], 1);
        expect(create).toHaveBeenCalledTimes(1);
        expect(upsert).toHaveBeenCalledTimes(1);
    });

    test('project permission denial prevents both writes', async () => {
        const { budgets, settings, create, upsert, projects } = fixture();
        projects.authorize.mockImplementation(async () => { throw new Error('denied'); });
        await expect(budgets.create(user(), body, 10, 1)).rejects.toThrow('denied');
        await expect(settings.createOrUpdateSetting(10, user(), [], 1)).rejects.toThrow('denied');
        expect(create).not.toHaveBeenCalled();
        expect(upsert).not.toHaveBeenCalled();
    });
});
