import {t} from 'elysia';
import { ResponseObjects } from './types';
import { errorSchema } from '@schemas/error';

export const schema = {
    getAll: {
        params: t.Object({
            eid: t.Number()
        }),
        query: t.Object({
            entity: t.Any()
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        },
        detail: {
            tags: ['Настройки'],
            description: 'Получить все настройки сущности'
        }
    },

    byGroup: {
        params: t.Object({
            eid: t.Number(),
            gid: t.Number()
        }),
        query: t.Object({
            entity: t.Any()
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        },
        detail: {
            tags: ['Настройки'],
            description: 'Получить настройки сущности по группе'
        }
    }
}