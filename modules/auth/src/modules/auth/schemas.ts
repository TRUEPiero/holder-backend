import { errorSchema } from "@schemas/error";
import { ResponseObject } from "../../common/types/user";
import { t } from "elysia";

export const schema = {
    login: {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        }),
        response: {
            200: ResponseObject,
            ...errorSchema
        },
        cookie: t.Cookie(t.Any()),
        detail: {
            description: 'Авторизация',
            tags: ['Авторизация']
        },
    },
    refresh: {
        response:{ 
            200: t.Boolean(),
            ...errorSchema
        },
        detail: {
            description: 'Обновление acces token',
            tags: ['Авторизация']
        },
    },
    logout: {
        response:{ 
            200: t.Boolean(),
            ...errorSchema
        },
        detail: {
            description: 'Разавторизация',
            tags: ['Авторизация']
        },
    }
}