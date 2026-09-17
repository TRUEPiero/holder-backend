import { t } from "elysia";

export type User = {
    id: number
    name: string
    email: string
    status: string
    telegram: string | null
    telegramId: string | null
}

export const ResponseUser = t.Object({
    id: t.Number(),
    name: t.String(),
    email: t.String(),
    status: t.String(),
    telegram: t.Nullable(t.Any()),
    telegramId: t.Nullable(t.Any()),
})

export const ResponseObject = t.Object({
    data: t.Nullable(ResponseUser)
})