import { setting, Setting } from "@schemas/common";
import { t } from "elysia";

type Cashbox = {
    id: number,
    settings: any,
    title: string,
    description?: string,
    balance: number,
}

type UpdateData = {
    title?: string,
    settings?: Setting[],
    description?: string,
}

const ResponseCashbox = t.Object({
    id: t.Number(),
    settings: t.Array(setting),
    title: t.String(),
    description: t.Nullable(t.String()),
    balance: t.Any(),
})

const ResponseObject = t.Object({
    data: ResponseCashbox
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseCashbox)
})

export type {
    Cashbox,
    UpdateData,
}

export {
    ResponseCashbox,
    ResponseObject,
    ResponseObjects
}