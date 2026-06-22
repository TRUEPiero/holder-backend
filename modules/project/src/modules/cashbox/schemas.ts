import { errorSchema } from "@schemas/error";
import { t } from "elysia";
import { ResponseDetailObject, ResponseObject, ResponseObjects } from "./types";

export const schema = {
    getAll: {
        params: t.Object({
            pid: t.Number(),
        }),
        detail: {
            tags: ['Счета'],
            description: 'Получить все счета',
        },
        response: {
            200: ResponseObjects,
            ...errorSchema
        }
    },
    detail: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        detail: {
            tags: ['Счета'],
            description: 'Получить счет по ID',
        },
        response: {
            200: ResponseDetailObject,
            ...errorSchema
        }
    },
    create: {
        params: t.Object({
            pid: t.Number(),
        }),
        body: t.Object({
            title: t.String(),
            description: t.Optional(t.String())
        }),
        detail: {
            tags: ['Счета'],
            description: 'Создать счет',
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    },
    update: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        body: t.Partial(
            t.Object({
                title: t.String(),
                description: t.String()
            })
        ),
        detail: {
            tags: ['Счета'],
            description: 'Обновить счет',
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }, 
    delete:  {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        detail: {
            tags: ['Счета'],
            description: 'Удалить счет'
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }
}