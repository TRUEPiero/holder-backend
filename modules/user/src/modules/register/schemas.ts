import { errorSchema } from "@schemas/error";
import { ResponseObject } from "../../common/types/user";
import { t } from "elysia";

export const schema = {
    register: {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
            verify_code: t.String()
        }),
        detail: {
            description: 'Регистрация',
            tags: ['Регистрация']
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
            tags: ['Регистрация']
        },
        response: {
            200: t.Boolean(),
            ...errorSchema
        }
    },
    checkVerify: {
        body: t.Object({
            email: t.String(),
            verify_code: t.String()
        }),
        detail: {
            description: 'Регистрация',
            tags: ['Регистрация']
        },
        response: {
            200: t.Object({
                data: t.Object({
                    email: t.String(),
                    verifyToken: t.String()
                })
            }),
            ...errorSchema
        }
    }
}