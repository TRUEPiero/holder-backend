import { errorSchema } from "@schemas/error";
import {t} from 'elysia';
import { ResponseGrouped, ResponseObjects, Tag, TypesUnion } from "./types";

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
        query: t.Object({
            tags: t.Optional(t.Array(t.Number()))
        }),
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
            tag: t.Optional(Tag)
        }),
        response: {
            200: t.Boolean(),
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
            tag: t.Optional(Tag)
        }),
        response: {
            200: t.Boolean(),
            ...errorSchema
        },
        detail: {
            tags: ['Транзации'],
            description: 'Внешняя операция'
        }
    }
}