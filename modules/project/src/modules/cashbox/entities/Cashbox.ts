import { Entity } from "../../../interfaices/Entity";
import { SettingTarget } from "../../../interfaices/SettingsOwner";
import { Transaction } from "../../transaction/types";
import { UpdateData } from "../types";
import { DecimalClass as Decimal, DecimalType } from "@shared-types/index.ts";

export class CashboxEntity extends Entity implements SettingTarget {
    private title: string;
    private balance: DecimalType;
    private description: string;
    private projectId: number;
    private settings: any;
    private transactions: Transaction[];
    
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
    }

    public getTitle() {
        return this.title
    }

    public getSettings() {
        return this.settings;
    }

    public update(data: UpdateData) {
        const {balance, ...dataWithoutParams} = data;
        
        for(const [key, value] of Object.entries(dataWithoutParams)) {
            (this as any)[key] = value
        }
        
        this.balance = new Decimal(balance!);

        return {
            title: this.title,
            desciption: this.description
        };
    }

    public response(): any {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            settings: this.settings,
            balance: this.balance,
        }
    }
}