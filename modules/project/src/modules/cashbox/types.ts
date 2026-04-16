import { t } from "elysia";

export type Cashbox = {
    id: number,
    settings: any,
    title: string,
    description?: string,
    balance: number,
}

export type UpdateData = {
    title?: string,
    settings?: Setting[],
    description?: string,
}

type Setting = {
    code: string,
    value: any
} 

export const ResponseCashbox = t.Object({
    id: t.Number(),
    settings: t.Any(),
    title: t.String(),
    description: t.Nullable(t.String()),
    balance: t.Any(),
})

export const ResponseObject = t.Record(
    t.String() , t.Nullable(ResponseCashbox)
)

export const ResponseObjects = t.Record(
    t.String(), t.Array(ResponseCashbox)
)
