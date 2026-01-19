import { errorSchema } from "@schemas/error";
import { ResponseObject } from "../types/user";
import { t } from "elysia";

export const schema = {
    login: {
        body: t.Object({
            login: t.String(),
            password: t.String(),
            remember: t.Boolean()
        }),
        detail: {
            description: 'Авторизация',
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    },
    logout: {
        response:{ 
            200: t.Boolean(),
            ...errorSchema
        }
    }
}