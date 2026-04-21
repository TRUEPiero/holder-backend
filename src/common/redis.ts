import { createClient } from "redis";
import type {RedisClientType} from 'redis';

let client: RedisClientType | null = null;

export function getRedis(): RedisClientType {
    if(client) return client

    client = createClient({
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',

        socket: {
            reconnectStrategy(retries) {
                return Math.min(retries * 100, 3000);
            }
        }
    })

    client.on('error', (err) => {
        console.error('[Redis] error:', err);
    });

    client.on('connect', () => {
        console.log('[Redis] connected');
    });

    client.on('reconnecting', () => {
        console.warn('[Redis] reconnecting...');
    });

    return client;
}

export async function initRedis() {
    const redis = getRedis();

    if(!redis.isOpen) await redis.connect();
}