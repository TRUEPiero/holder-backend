import { randomBytes } from 'node:crypto';
import { AlreadyExistError, UnautorizedError } from '@common/errors';
import type { CasheService } from '@services/CasheService';
import type { UserRepository } from '../../modules/user/repository';
import type { UserEntity } from '../../modules/user/entities/User';

const LINK_TTL_SECONDS = 300;

export class TelegramLinkService {
    constructor(
        private cache: Pick<CasheService, 'set' | 'getDel'>,
        private users: Pick<UserRepository, 'linkTelegramIfUnlinked'>,
    ) {}

    async issue(user: UserEntity) {
        // Existing links cannot be replaced through the linking flow.
        if (user.getTelegramId()) throw new AlreadyExistError('TELEGRAM_LINK');
        const token = randomBytes(32).toString('base64url');
        await this.cache.set(`telegram-link:${token}`, user.getId(), LINK_TTL_SECONDS);
        return { token, expiresIn: LINK_TTL_SECONDS };
    }

    async consume(token: string, telegramId: string, username?: string) {
        if (!/^[A-Za-z0-9_-]{43}$/.test(token) || !/^[1-9]\d*$/.test(telegramId)) {
            throw new UnautorizedError();
        }
        // GETDEL makes a token single-use even with concurrent bot updates.
        const userId = await this.cache.getDel<number>(`telegram-link:${token}`);
        if (typeof userId !== 'number' || !Number.isSafeInteger(userId) || userId <= 0) {
            throw new UnautorizedError();
        }
        const user = await this.users.linkTelegramIfUnlinked(userId, telegramId, username);
        if (!user) throw new AlreadyExistError('TELEGRAM_LINK');
        return user;
    }
}
