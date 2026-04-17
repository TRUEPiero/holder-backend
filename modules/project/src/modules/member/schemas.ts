import { errorSchema } from "@schemas/error";
import {t} from 'elysia';
import { ResponseMember, ResponseObject } from "./types";

export const schema = {
    invite: {    
        params: t.Object({
            pid: t.Number()
        }),
        body: t.Object({
            email: t.String()
        }),
        response: t.Boolean(),
        detail: {
            tags: ['Участники'],
            desctiprion: 'Отправить приглашение'
        }
    },

    accept: {
        params: t.Object({
            pid: t.Number()
        }),
        body: t.Object({
            code: t.String()
        }),
        response: {
            200: ResponseObject,
            ...errorSchema
        },
        detail: {
            tags: ['Участники'],
            desctiprion: 'Принять приглашение'
        }
    },

    updateRole: {
        params: t.Object({
            pid: t.Number(),
            mid: t.Number(),
        }),
        body: t.Object({
            role: t.Any()
        }),
        response: {
            200: ResponseObject,
            ...errorSchema
        },
        detail: {
            tags: ['Участники'],
            desctiprion: 'Обновить роль участника'
        }
    }
}