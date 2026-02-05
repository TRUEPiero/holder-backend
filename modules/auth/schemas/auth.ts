import { errorSchema } from "@schemas/error";
import { ResponseObject } from "../types/user";
import { t } from "elysia";

export const schema = {
    login: {
        body: t.Object({
            login: t.String(),
            password: t.String(),
            remember: t.Optional(t.Boolean())
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
    logout: {
        detail: {
            description: 'Разавторизация',
            tags: ['Авторизация']
        },
        response:{ 
            200: t.Boolean(),
            ...errorSchema
        }
    },
    register: {
        body: t.Object({
            login: t.String(),
            email: t.String(),
            password: t.String(),
            telegram: t.Optional(t.String())
        }),
        detail: {
            description: 'Регистрация',
            tags: ['Авторизация']
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }
}