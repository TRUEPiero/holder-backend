import { errorSchema } from "@schemas/error";
import { ResponseUser } from "../types/user";
import { t } from "elysia";

export const schema = {
    login: {
        detail: {
            description: 'Авторизация',
        },
        response: {
            200: ResponseUser,
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