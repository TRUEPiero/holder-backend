import { Prisma, SettingTarget, SettingType } from "@prisma/client"
import { t } from "elysia"

type SettingTypes  = SettingType
type SettingTargets = SettingTarget
type GetSettingFilter = Prisma.SettingDefinitionWhereInput

type Setting = {
    id: number,
    code: string,
    description: string
    groupId: number
    type: SettingTypes
    values: any[]
    value: any
    target: SettingTargets
    isRequired: boolean
    isDisabled: boolean
    isTelegram: boolean
    createdAt: Date
}

type EntitySetting = {
    settingId: number,
    value: string
}

const SettingEntity = t.Object({
    code: t.String(),
    value: t.String(), 
})

const ResponseSetting = t.Any()

const ResponseObject = t.Object({
    data: ResponseSetting
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseSetting)
})

export type {
    Setting,
    EntitySetting,
    SettingTypes,
    SettingTargets,
    GetSettingFilter
}

export {
    SettingEntity,
    ResponseSetting,
    ResponseObject,
    ResponseObjects
}