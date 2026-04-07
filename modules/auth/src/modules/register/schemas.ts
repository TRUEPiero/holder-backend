import { errorSchema } from "@schemas/error";
import { ResponseObject } from "../../../common/types/user";
import { t } from "elysia";

export const schema = {
    register: {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        }),
        detail: {
            description: 'Регистрация',
            tags: ['Авторизация']
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    },
    sendVerify: {
        body: t.Object({
            email: t.String(),
        }),
        detail: {
            description: 'Регистрация',
            tags: ['Авторизация']
        },
        response: {
            200: t.Boolean(),
            ...errorSchema
        }
    },
    checkVerify: {
        body: t.Object({
            verify_code: t.String()
        }),
        detail: {
            description: 'Регистрация',
            tags: ['Авторизация']
        },
        response: {
            200: t.Boolean(),
            ...errorSchema
        }
    }
}