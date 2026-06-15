import { setting, Setting } from "@schemas/common";
import { t } from "elysia";

type Cashbox = {
    id: number,
    settings: any,
    title: string,
    description: string,
    balance: number,
}

type UpdateData = {
    title?: string,
    description?: string,
    balance?: number | string
}

const ResponseCashbox = t.Object({
    id: t.Number(),
    title: t.String(),
    description: t.String(),
    balance: t.Any(),
})

const ResponseDetailCashbox = t.Object({
    id: t.Number(),
    settings: t.Array(setting),
    title: t.String(),
    description: t.String(),
    balance: t.Any(),
})

const ResponseObject = t.Object({
    data: ResponseCashbox
})

const ResponseDetailObject = t.Object({
    data: ResponseDetailCashbox
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
    ResponseDetailCashbox,
    ResponseObject,
    ResponseDetailObject,
    ResponseObjects
}