import {t} from 'elysia';

export const schema = {
    getAll: {
        query: t.Object({
            entity: t.String()
        }),
        detail: {
            tags: ['Настройки'],
            description: 'Получить все настройки сущности'
        }
    },

}