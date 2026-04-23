import { errorSchema } from "@schemas/error";
import {t} from 'elysia';
import { ResponseDetailObject, ResponseObject, ResponseObjects } from "./types";
import { setting } from "@schemas/common";

export const schema = {
    getAll: {
        detail: {
            tags: ['Проект'],
            description: 'Получить все проекты',
        },
        response: {
            200: ResponseObjects,
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
            200: ResponseDetailObject,
            ...errorSchema
        }
    },
    create: {
        body: t.Partial(
            t.Object({
                title: t.String(),
                settings: t.Array(setting)
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
                settings: t.Array(setting)
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