import { t } from "elysia";

export const ResponseObject = t.Object({
    id: t.Number(),
    parameters: t.Any(),
    title: t.String(),
    descriprion: t.Nullable(t.String()),
    amount: t.Number(),
    createdAt: t.Date(),
    updatedAt: t.Date()
})