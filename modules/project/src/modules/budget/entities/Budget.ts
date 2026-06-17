import { DecimalType } from "@shared-types/index.ts";
import { Entity } from "../../../interfaces/Entity";
import { updateData } from "../types";

export class BudgetEntity extends Entity {
    private title: string
    private description: string
    private amount: DecimalType
    private cashboxId: number
    private cashbox: any
    private startDate: Date
    private endDate: Date
    private isActive: boolean
    private createdAt: Date
    private updatedAt: Date

    constructor(params: any){
        super(params)
        this.title = params.title || ''
        this.description = params.description || ''
        this.amount = params.amount
        this.cashboxId = params.cashboxId
        this.cashbox = params.cashbox
        this.startDate = params.startDate
        this.endDate = params.endDate
        this.isActive = params.isActive
        this.createdAt = params.createdAt
        this.updatedAt = params.updatedAt
    }

    public update(data: updateData) {
        for(const [key, value] of Object.entries(data)) {
            (this as any)[key] = value
        }

        return {
            title: this.title,
            description: this.description,
            amount: this.amount,
            startDate: this.startDate,
            endDate: this.endDate,
            isActive: this.isActive,
        };
    }

    response() {
        return {
            title: this.title,
            description: this.description,
            amount: this.amount,
            cashboxId: this.cashboxId,
            startDate: this.startDate,
            endDate: this.endDate,
            isActive: this.isActive,
        }
    }
}