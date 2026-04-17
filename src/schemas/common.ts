import { t } from "elysia"

type Setting = {
  code: string,
  value: string
}

const setting = t.Object({
    code: t.String(),
    value: t.String(),
})

export type {
  Setting
}

export {
  setting
}