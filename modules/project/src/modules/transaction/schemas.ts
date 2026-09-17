import { errorSchema } from "@schemas/error";
import { t } from 'elysia';
import { ResponseGrouped, ResponseObject, ResponseObjects, Tag, TypesUnion } from "./types";

export const schema = {
    getByCashbox: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        },
        query: t.Partial(t.Object({
            tag: t.Number(),
            start: t.Date(),
            end: t.Date()
        })),
        detail: {
            tags: ['Транзации'],
            description: 'Получить операции счета'
        }
    },
    getTags: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        query: t.Partial(t.Object({
            start: t.Date(),
            end: t.Date()
        })),
        response: {
            200: ResponseGrouped,
            ...errorSchema
        },
        detail: {
            tags: ['Транзации'],
            description: 'Получить теги операций по счету'
        }
    },
    transfer: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        body: t.Object({
            to: t.Number(),
            amount: t.Number(),
            tag: t.Optional(Tag),
            description: t.Optional(t.String())
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        },
        detail: {
            tags: ['Транзации'],
            description: 'Перевод между счетами'
        }
    },
    external: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        body: t.Object({
            amount: t.Number(),
            type: TypesUnion,
            tag: t.Optional(Tag),
            description: t.Optional(t.String())
        }),
        response: {
            200: ResponseObject,
            ...errorSchema
        },
        detail: {
            tags: ['Транзации'],
            description: 'Внешняя операция'
        }
    },
    cancel: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number(),
            tid: t.Number(),
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        },
        detail: {
            tags: ['Транзации'],
            description: 'Отмена транзации'
        }
    }
}