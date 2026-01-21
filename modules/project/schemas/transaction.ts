import { errorSchema } from "@schemas/error";
import {t} from 'elysia';
import { ResponseObject, ResponseObjects } from "../types/transaction";

export const schema = {
    get: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        response: {
            200: ResponseObjects,
            ...errorSchema
        }
    },

    transfer: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        body: t.Object({
            to: t.Number(),
            amount: t.Number()
        }),
        response: {
            200: t.Boolean(),
            ...errorSchema
        }
    }
}