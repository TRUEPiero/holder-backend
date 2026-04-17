import { SettingType } from "@prisma/client"

type SettingTypes  = SettingType

type Setting = {
    id: number,
    code: string,
    description: string
    groupId: number
    type: SettingTypes
    values: any[]
}

export type {
    Setting,
    SettingTypes
}