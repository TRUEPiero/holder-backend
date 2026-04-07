import { errorSchema } from "@schemas/error";
import {t} from 'elysia';
import { ResponseObject, ResponseObjects } from "./types";

export const schema = {
    getAll: {
        detail: {
            tag: [''],
            description: 'Получить все элементы',
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
            tag: [''],
            description: 'Получить проект по ID',
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    },
    create: {
        body: t.Object({
            title: t.String(),
            parameters: t.Any()
        }),
        detail: {
            tag: [''],
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
        body: t.Any(),
        detail: {
            tag: [''],
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
            tag: [''],
            description: 'Удалить проект'
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }
}