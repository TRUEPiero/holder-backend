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

    private setParameters(newParams: any[] = []) {
        const map = new Map<string, any>();

        for (const param of this.settings) {
            map.set(param.code, param);
        }

        for (const param of newParams) {
            map.set(param.code, param);
        }

        this.settings = Array.from(map.values());
    }

    private formatRole(member: any) {
        return {
            name: member.role.name,
            permissions: member.role.permissions.map((perm: {permission: {entity: string, setting: string}}) => `${perm.permission.entity}:${perm.permission.setting}`)
        }
    }

    private formatMembers(members: any[]) {
        if(!members) return [];

        return members.map((member: any) => {
            return {
                memberId: member.id,
                ...member.user,
                role: member.role.name,
                password: undefined
            }
        })
    }

    public response() {
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