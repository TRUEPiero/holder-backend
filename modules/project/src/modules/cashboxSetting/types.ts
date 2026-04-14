import { SettingType } from "@prisma/client"

export type Setting = {
    id: number,
    code: string,
    description: string
    groupId: number
    type: SettingType
    values: any[]
}