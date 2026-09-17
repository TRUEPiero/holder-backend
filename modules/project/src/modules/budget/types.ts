import { DecimalType } from "@shared-types/index"
import { t } from "elysia"
import { Cashbox } from "../cashbox/types"

type EntityParams = {
    title: string
    description: string
    amount: DecimalType
    cashboxId: number
    cashbox?: Cashbox
    startDate: Date
    endDate: Date
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

type createBody = {
    title?: string
    description?: string
    amount: number
    startDate: Date
    endDate: Date
}

type createData = {
    title?: string
    description?: string
    cashboxId: number,
    amount: DecimalType
    startDate: Date
    endDate: Date
    isActive?: boolean
}

type updateData = {
    title?: string
    description?: string
    amount?: DecimalType | number
    startDate?: Date
    endDate?: Date
    isActive?: boolean
}

type updateDataRepo = {
    title?: string;
    description?: string;
    amount?: DecimalType;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
}

const ResponseBudget = t.Object({
    title: t.String(),
    description: t.String(),
    amount: t.Number(),
    cashboxId: t.Number(),
    startDate: t.Date(),
    endDate: t.Date(),
    isActive: t.Boolean()
})

const ResponseObject = t.Object({
    data: ResponseBudget
})

const ResponseActive = t.Object({
    data: t.Nullable(ResponseBudget)
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseBudget)
})

export type {
    EntityParams,
    createData,
    createBody,
    updateData,
    updateDataRepo
}

export {
    ResponseObject,
    ResponseActive,
    ResponseObjects
}