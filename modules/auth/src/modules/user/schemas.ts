import { t } from "elysia"
import { ResponseObject } from "../../common/types/user"
import { errorSchema } from "@schemas/error"

export const schema = {
    getUser: {
        detail: {
            description: 'Получить текущего пользователя',
            tags: ['Пользователи']
        },
        response: {
            200: ResponseObject,
            ...errorSchema
        }
    }, 
    updateUser: {
        body: t.Partial(
            t.Object({
                name: t.String(),
                telegram: t.String(),
                password: t.String()
            })
        ),
        detail: {
            description: 'Обновить пользователя',
            tags: ['Пользователи']
        },
        response: {
            200: ResponseObject, 
            ...errorSchema
        }
    }
}