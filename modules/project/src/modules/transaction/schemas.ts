import { errorSchema } from "@schemas/error";
import {t} from 'elysia';
import { ResponseObjects } from "./types";

export const schema = {
    get: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        query: t.Any(),
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
    },
    external: {
        params: t.Object({
            pid: t.Number(),
            cid: t.Number()
        }),
        body: t.Object({
            amount: t.Number(),
            type: t.String()
        }),
        response: {
            200: t.Boolean(),
            ...errorSchema
        }
    }
}