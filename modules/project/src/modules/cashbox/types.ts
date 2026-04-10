import { t } from "elysia";

export type Cashbox = {
    id: number,
    parameters: any,
    title: string,
    description?: string,
    balance: number,
}

export const ResponseCashbox = t.Object({
    id: t.Number(),
    parameters: t.Any(),
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
