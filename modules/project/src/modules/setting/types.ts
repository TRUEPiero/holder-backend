import { Prisma, SettingType } from "@prisma/client"
import { SettingTargets } from "@shared-types/index"
import { t } from "elysia"

type SettingTypes  = SettingType
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

type updateData = {
    id: number,
    value: any
}

const group = t.Object({
    id: t.Number(),
    code: t.String(),
    title: t.String(),
    description: t.String(),
    target: t.String(),
})

const SettingEntity = t.Object({
    code: t.String(),
    value: t.String(), 
})

const ResponseSetting = t.Object({
    id: t.Number(),
    code: t.String(),
    title: t.String(),
    description: t.String(),
    groupId: t.Number(),
    type: t.String(),
    values: t.Nullable(t.Array(t.Any())),
    value: t.Any(),
    isRequired: t.Boolean(),
    isDisabled: t.Boolean(),
    isTelegram: t.Boolean(),
})

const ResponseGroup = t.Object({
    data: group
})

const ResponseGroups = t.Object({
    data: t.Array(group)
})

const ResponseObject = t.Object({
    data: ResponseSetting
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseSetting)
})

export type {
    Setting,
    SettingTypes,
    GetSettingFilter,
    updateData
}

export {
    SettingEntity,
    ResponseSetting,
    ResponseObject,
    ResponseObjects,
    ResponseGroup,
    ResponseGroups
}