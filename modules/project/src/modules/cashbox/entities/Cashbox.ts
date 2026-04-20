import { Transaction } from "../../transaction/types";
import { UpdateData } from "../types";
import { Money } from "./Money";
import { DecimalClass as Decimal, DecimalType } from "@shared-types/index.ts";

export class CashboxEntity {
    public id: number;
    public projectId: number;
    public balance: DecimalType;
    public title: string;
    public description: string;
    public settings: any;
    public transactions: Transaction[];
    
    constructor(
        params: any
    ) {
        this.id = params.id;
        this.projectId = params.projectId;
        this.balance = new Decimal(params.balance);
        this.title = params.title;
        this.description = params.description || '';
        this.settings = params.settings || []
        this.transactions = params.transactions || [];
    }

    public debit(amount: Money) {
        if (this.balance.lessThan(amount.get())) {
            throw new Error("BALANSE_LESS_AMOUNT");
        }
        this.balance = this.balance.sub(new Decimal(amount.get()));
    }

    public credit(amount: Money) {
        this.balance = this.balance.add(new Decimal(amount.get()));
    }

    public update(data: UpdateData) {
        const {settings, ...dataWithoutParams} = data;
        
        for(const [key, value] of Object.entries(dataWithoutParams)) {
            if(value.toString()) (this as any)[key] = value
        }

        this.setParameters(settings);

        return {
            title: this.title,
            settings: this.settings,
        };
    }

    public getSettings() {
        if(typeof this.settings === 'string') return JSON.parse(this.settings);
        
        return this.settings;
    }

    private setParameters(newParams: any) {
        const preparedParams = newParams;
        this.settings = preparedParams;
    }

    public toJSON(): any {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            settings: this.settings,
            balance: this.balance,
        }
    }
}