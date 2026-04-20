import { Prisma, SettingTarget, SettingType } from "@prisma/client"

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
    code: string,
    value: string
}

export type {
    Setting,
    EntitySetting,
    SettingTypes,
    SettingTargets,
    GetSettingFilter
}