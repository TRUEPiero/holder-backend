import { t } from "elysia"

const settingValue = t.Union([
  t.String(),
  t.Boolean(),
  t.Number()
])

type SettingValue = string | boolean | number

type Setting = {
  code: string,
  value: SettingValue
}

const setting = t.Object({
    code: t.String(),
    value: settingValue,
})

export type {
  Setting
}

export {
  setting
}