import { Setting } from "@schemas/common";
import { UpdateData } from "../types";
import { Cashbox } from "../../cashbox/types";
import { DecimalClass as Decimal, DecimalType } from "@shared-types/index.ts";

export class ProjectEntity {
    public id: number;
    public title: string;
    public balance: DecimalType;
    public settings: Setting[];
    public ownerId: number;
    public members: any[];
    public cashboxes: Cashbox[];
    
    constructor(params: any) {
        this.id = params.id;
        this.title = params.title;
        this.balance = this.calculateTotalSum(params.cashboxes);
        this.settings = params.settings;
        this.ownerId = params.ownerId;
        this.members = params.members;
        this.cashboxes = params.cashboxes;
    }
    

    public getSettings() {
        if(typeof this.settings === 'string') return JSON.parse(this.settings);
        
        return this.settings;
    }

    public update(data: UpdateData) {
        const {settings, ...dataWithoutParams} = data;
        
        for(const [key, value] of Object.entries(dataWithoutParams)) {
            if(value.toString()) (this as any)[key] = value
        }

        this.setParameters(settings);

        return {
            title: this.title,
            ownerId: this.ownerId,
            settings: this.settings,
        };
    }

    private calculateTotalSum(cashboxes: any[]) {
        const summ = cashboxes.reduce((summ, cashbox) => summ + cashbox.balance, 0);

        return new Decimal(summ);
    }

    private setParameters(newParams: any) {
        const preparedParams = newParams;
        this.settings = preparedParams;
    }

    private formatMembers(members: any[]) {
        if(!members) return [];

        return members.map((member: any) => {
            return {
                ...member.user,
                role: member.role,
                password: undefined
            }
        })
    }

    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            balance: this.balance,
            settings: this.settings,
            ownerId: this.ownerId,
            members: this.formatMembers(this.members),
            cashboxes: this.cashboxes,
        }
    }

}