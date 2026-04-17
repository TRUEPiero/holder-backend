import { t } from "elysia";

export type User = {
    id: number
    name: string
    status: string,
    telegram?: string
    telegramId?: number
}

export const ResponseUser = t.Object({
    id: t.Number(),
    name: t.String(),
    status: t.String(),
    telegram: t.Nullable(t.Any()),
    telegramId: t.Nullable(t.Any()),
})

export const ResponseObject = t.Record(
    t.String(), t.Nullable(ResponseUser)
)