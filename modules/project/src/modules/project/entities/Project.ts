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
        this.settings = params.settings || [];
        this.ownerId = params.ownerId;
        this.members = params.members;
        this.cashboxes = params.cashboxes;
    }
    

    public getSettings() {
        return this.settings;
    }

    public update(data: UpdateData) {
        for(const [key, value] of Object.entries(data)) {
            if(value.toString()) (this as any)[key] = value
        }

        return {
            title: this.title,
        };
    }

    public getMembers() {
        return this.members.map(member => ({
            id: member.id,
            isDeleted: member.isDeleted,
            userId: member.userId,
            user: member.user,
            role: this.formatRole(member)
        }))
    }

    private calculateTotalSum(cashboxes: any[]) {
        if(!cashboxes || !cashboxes.length) return new Decimal(0);

        const summ = cashboxes.reduce((summ, cashbox) => summ.plus(cashbox.balance), new Decimal(0));

        return new Decimal(summ);
    }

    private formatRole(member: any) {
        return {
            name: member.role.name,
            permissions: member.role.permissions.map((perm: {permission: {entity: string, setting: string}}) => `${perm.permission.entity}:${perm.permission.setting}`)
        }
    }

    private formatMembers() {
        if(!this.members) return [];

        return this.members.map((member: any) => {
            return {
                memberId: member.id,
                ...member.user,
                role: member.role.name,
                password: undefined
            }
        })
    }

    private formatSettings() {
        if(!this.settings) return [];

        return this.settings.map((setting: any) => ({
            settingId: setting.settingId,
            code: setting.setting.code,
            value: setting.value
        })) 
    }

    public response() {
        return {
            id: this.id,
            ownerId: this.ownerId,
            title: this.title,
            balance: this.balance,
            settings: this.formatSettings(),
            members: this.formatMembers(),
            cashboxes: this.cashboxes,
        }
    }

}