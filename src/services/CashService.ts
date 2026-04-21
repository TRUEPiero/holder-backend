// cache.service.ts
import { getRedis } from '../common/redis';

export class CasheService {
    private redis = getRedis();

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        if (!data) return null;

        try {
            return JSON.parse(data) as T;
        } catch {
            return null;
        }
    }

    async set<T>(key: string, value: T, ttlSeconds?: number) {
        const payload = JSON.stringify(value);

        if (ttlSeconds) {
            await this.redis.set(key, payload, { EX: ttlSeconds });
        } else {
            await this.redis.set(key, payload);
        }
    }

    async del(key: string) {
        await this.redis.del(key);
    }

    async delMany(keys: string[]) {
        if (keys.length === 0) return;
        await this.redis.del(keys);
    }

    async exists(key: string): Promise<boolean> {
        const res = await this.redis.exists(key);
        return res === 1;
    }

    // атомарный счётчик (rate limit и т.п.)
    async incr(key: string, ttlSeconds?: number): Promise<number> {
        const value = await this.redis.incr(key);

        if (value === 1 && ttlSeconds) {
            await this.redis.expire(key, ttlSeconds);
        }

        return value;
    }
}