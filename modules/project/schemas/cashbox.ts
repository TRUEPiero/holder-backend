import { errorSchema } from "@schemas/error";
import { t } from "elysia";
import { ResponseObject, ResponseObjects } from "../types/cashbox";

export const schema = {
    getAll: {
        params: t.Object({
            pid: t.Number(),
        }),
        detail: {
            tag: [''],
            description: 'Получить все элементы',
        },
        response: {
            200: ResponseObjects,
            ...errorSchema
        }
    },
    create: {
        params: t.Object({
            pid: t.Number(),
        }),
        body: t.Object({
            title: t.String()
        }),
        detail: {
            tag: [''],
            description: 'Создать элемент',
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
        body: t.Any(),
        detail: {
            tag: [''],
            description: 'Обновить элемент',
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
            tag: [''],
            description: 'Удалить элемент'
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }
}