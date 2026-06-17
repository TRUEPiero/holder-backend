import { SettingTarget } from "../../../interfaces/Entity";
import { Transaction } from "../../transaction/types";
import { UpdateData } from "../types";
import { DecimalClass as Decimal, DecimalType } from "@shared-types/index.ts";

export class CashboxEntity extends SettingTarget {
    private title: string;
    private balance: DecimalType;
    private description: string;
    private projectId: number;
    private transactions: Transaction[];
    private plans: any[]
    
    constructor(
        params: any
    ) {
        super(params);
        this.projectId = params.projectId;
        this.balance = new Decimal(params.balance);
        this.title = params.title;
        this.description = params.description || '';
        this.settings = params.settings || []
        this.transactions = params.transactions || [];
        this.plans = params.plans || []
    }

    public getTitle() {
        return this.title
    }

    public update(data: UpdateData) {
        const {...dataWithoutParams} = data;
        
        for(const [key, value] of Object.entries(dataWithoutParams)) {
            (this as any)[key] = value
        }

        return {
            title: this.title,
            description: this.description
        };
    }

    public response() {
        return {
            id: this.id,
            title: this.title,
            projectId: this.projectId,
            description: this.description,
            settings: this.formatSettings(),
            balance: this.balance,
            transactions: this.transactions,
            plans: this.plans,
        }
    }
}