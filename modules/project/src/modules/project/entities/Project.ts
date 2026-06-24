import { EntityParams, UpdateData } from "../types";
import { Cashbox } from "../../cashbox/types";
import { DecimalClass as Decimal, DecimalType } from "@shared-types/index";
import { SettingTarget } from "../../../interfaces/Entity";
import { Member } from "../../member/types";

export class ProjectEntity extends SettingTarget {
    private title: string;
    private balance: DecimalType;
    private ownerId: number;
    private members: Member[];
    private cashboxes: Cashbox[];
    
    constructor(params: EntityParams) {
        super(params);
        this.title = params.title;
        this.balance = this.calculateTotalSum(params.cashboxes);
        this.settings = params.settings || [];
        this.ownerId = params.ownerId;
        this.members = params.members;
        this.cashboxes = params.cashboxes;
    }

    public getTitle() {
        return this.title;
    }

    public getOwner() {
        return this.ownerId
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

    public update(data: UpdateData) {
        for(const [key, value] of Object.entries(data)) {
            if(value.toString()) (this as any)[key] = value
        }

        return {
            title: this.title,
        };
    }

    private calculateTotalSum(cashboxes: Cashbox[]) {
        if(!cashboxes || !cashboxes.length) return new Decimal(0);

        const summ = cashboxes.reduce((summ, cashbox) => summ.plus(cashbox.balance), new Decimal(0));

        return new Decimal(summ);
    }

    private formatRole(member: Member) {
        return {
            name: member.role.name,
            permissions: member.role.permissions.map((perm: {permission: {entity: string, setting: string}}) => `${perm.permission.entity}:${perm.permission.setting}`)
        }
    }

    private formatMembers() {
        if(!this.members) return [];

        return this.members.map((member) => {
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
            ownerId: this.ownerId,
            title: this.title,
            balance: this.balance,
            settings: this.formatSettings(),
            members: this.formatMembers(),
            cashboxes: this.cashboxes,
        }
    }

}