import { t } from "elysia";

export const ResponseObject = t.Object({
    id: t.Number(),
    name: t.String(),
    login: t.String(),
    role: t.String(),
    telegram: t.Any()
})