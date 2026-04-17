import { SettingType } from "@prisma/client"

type Setting = {
    id: number,
    code: string,
    description: string
    groupId: number
    type: SettingType
    values: any[]
}
 export type {
    Setting
 }