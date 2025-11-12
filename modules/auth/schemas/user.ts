import { ResponseUser } from "../types/user"
import { errorSchema } from "@schemas/error"

export const schema = {
    getUser: {
        detail: {
            desciption: 'Получить текущего пользователя'
        },
        response: {
            200: ResponseUser,
            ...errorSchema
        }
    }
}