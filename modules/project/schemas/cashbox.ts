import { errorSchema } from "@schemas/error";
import { t } from "elysia";
import { ResponseObject } from "../types/cashbox";

export const schema = {
    getAll: {
        params: t.Object({
            pid: t.Number(),
        }),
        detail: {
            description: 'Получить все элементы',
        },
        response: {
            200: t.Array(ResponseObject),
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
            description: 'Создать элемент',
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }
}