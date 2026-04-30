import { errorSchema } from "@schemas/error";
import { ResponseObject } from "../../common/types/user";
import { t } from "elysia";

export const schema = {
    login: {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        }),
        detail: {
            description: 'Авторизация',
            tags: ['Авторизация']
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    },
    refresh: {
        detail: {
            description: 'Обновление acces token',
            tags: ['Авторизация']
        },
        response:{ 
            200: t.Boolean(),
            ...errorSchema
        }
    },
    logout: {
        detail: {
            description: 'Разавторизация',
            tags: ['Авторизация']
        },
        response:{ 
            200: t.Boolean(),
            ...errorSchema
        }
    }
}