import { errorSchema } from "@schemas/error";
import {t} from 'elysia';
import { ResponseObject, ResponseObjects, ResponseWithPagination } from "./types";

export const schema = {
    getAll: {
        query: t.Partial(t.Object({
            page: t.Number(),
            limit: t.Number()
        })),
        detail: {
            tags: ['Проект'],
            description: 'Получить все проекты',
        },
        response: {
            200: ResponseWithPagination,
            ...errorSchema
        }
    },
    detail: {
        params: t.Object({
            pid: t.Number()
        }),
        detail: {
            tags: ['Проект'],
            description: 'Получить проект по ID',
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    },
    tags: {
        params: t.Object({
            pid: t.Number()
        }),
        detail: {
            tags: ['Проект'],
            description: 'Получить проект по ID',
        },
        response: {
            200: t.Any(),
            ...errorSchema
        }
    },
    create: {
        body: t.Partial(
            t.Object({
                title: t.String(),
            })
        ),
        detail: {
            tags: ['Проект'],
            description: 'Создать проект',
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }, 
    update: {
        params: t.Object({
            pid: t.Number()
        }),
        body: t.Partial(
            t.Object({
                title: t.String(),
            })
        ),
        detail: {
            tags: ['Проект'],
            description: 'Обновить проект'
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    },
    delete: {
        params: t.Object({
            pid: t.Number()
        }),
        detail: {
            tags: ['Проект'],
            description: 'Удалить проект'
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }
}