import { DecimalType } from "@shared-types/index.ts"
import { t } from "elysia"

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
    amount?: DecimalType
    startDate?: Date
    endDate?: Date
    isActive?: boolean 
}

const ResponseBudget = t.Object({
    title: t.String(),
    desciption: t.String(),
    amount: t.Number(),
    cashboxId: t.Number(),
    startDate: t.Date(),
    endDate: t.Date(),
    isActive: t.Boolean()
})

const ResponseObject = t.Object({
    data: ResponseBudget
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseBudget)
})

export type {
    createData,
    updateData
}

export {
    ResponseObject,
    ResponseObjects
}