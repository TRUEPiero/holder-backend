import { t } from "elysia";

export const ResponseCashbox = t.Object({
    id: t.Number(),
    parameters: t.Any(),
    title: t.String(),
    descriprion: t.Nullable(t.String()),
    amount: t.Number(),
    createdAt: t.Date(),
    updatedAt: t.Date()
})

export const ResponseObject = t.Record(
    t.String() , t.Nullable(ResponseCashbox)
)

export const ResponseObjects = t.Record(
    t.String(), t.Array(ResponseCashbox)
)
