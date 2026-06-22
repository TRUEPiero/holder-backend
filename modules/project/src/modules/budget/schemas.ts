import { errorSchema } from "@schemas/error";
import { t } from "elysia";
import { ResponseObject, ResponseObjects } from "./types";

export const schema = {
    getActive: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number(),
        }),
        reponse: t.Object({
            200: ResponseObject,
            ...errorSchema
        }),
        detail: {
            tags: ['Бюджет'],
            description: 'Получить бюджет по ID счета',
        }
    },
    history: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number(),
        }),
        reponse: t.Object({
            200: ResponseObjects,
            ...errorSchema
        }),
        detail: {
            tags: ['Бюджет'],
            description: 'Получить историю бюджетов счета',
        }
    },
    create: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number(),
        }),
        body: t.Object({
            title: t.Optional(t.String()),
            desciption: t.Optional(t.String()),
            startDate: t.Date(),
            endDate: t.Date(),
            amount: t.Number(),
        }),
        reponse: t.Object({
            200: ResponseObject,
            ...errorSchema
        }),
        detail: {
            tags: ['Бюджет'],
            description: 'Создать план на счет',
        }
    },
    update: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number(),
            bid: t.Number()
        }),
        body: t.Partial(t.Object({
            title: t.String(),
            desciption: t.String(),
            startDate: t.Date(),
            endDate: t.Date(),
            amount: t.Number(),
            isActive: t.Boolean()
        })),
        reponse: t.Object({
            200: ResponseObject,
            ...errorSchema
        }),
        detail: {
            tags: ['Бюджет'],
            description: 'Создать план на счет',
        }
    }
}