import { t } from 'elysia';
import { ResponseGroups, ResponseObjects } from './types';
import { errorSchema } from '@schemas/error';

export const schema = {
    getAll: {
        query: t.Object({
            pid: t.Optional(t.Number())
        }),
        params: t.Object({
            entity: t.String(),
            eid: t.Number(),
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
            200: ResponseGroups,
            ...errorSchema
        },
        detail: {
            tags: ['Настройки'],
            description: 'Получить группы настроек сущности'
        }
    },

    byGroup: {
        query: t.Object({
            pid: t.Optional(t.Number())
        }),
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
        query: t.Object({
            pid: t.Optional(t.Number())
        }),
        params: t.Object({
            entity: t.String(),
            eid: t.Number(),
        }),
        body: t.Object({
            settings: t.Any()
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        },
        detail: {
            tags: ['Настройки'],
            description: 'Обновить настройки сущности'
        }
    }
}