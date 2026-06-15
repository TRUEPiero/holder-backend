import { t } from 'elysia';
import { ResponseObjects } from './types';
import { errorSchema } from '@schemas/error';

export const schema = {
    getAll: {
        params: t.Object({
            entity: t.String(),
            eid: t.Number()
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

    groups: {
        params: t.Object({
            entity: t.String(),
            eid: t.Number()
        }),
        response: {
            200: t.Any(),
            ...errorSchema
        },
        detail: {
            tags: ['Настройки'],
            description: 'Получить группы настроек сущности'
        }
    },

    byGroup: {
        params: t.Object({
            entity: t.String(),
            eid: t.Number(),
            gid: t.Number()
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        },
        detail: {
            tags: ['Настройки'],
            description: 'Получить настройки сущности по группе'
        }
    },

    update: {
        params: t.Object({
            entity: t.String(),
            eid: t.Number(),
        }),
        body: t.Object({
            settings: t.Any()
        }),
        detail: {
            tags: ['Настройки'],
            description: 'Обновить настройки сущности'
        }
    }
}