import { SettingType } from "@prisma/client";

export class SettingEntity {
    public id: number;
    public code: string;
    public title: string;
    public description: string;
    public groupId: number;
    public type: SettingType;
    public value: any;
    public values: any[];
    public isDisable: boolean;
    public isRequired: boolean;
    public telegram: boolean;


    constructor(params: any) {
        this.id = params.id;
        this.code = params.code;
        this.title = params.title;
        this.description = params.description;
        this.groupId = params.groupId;
        this.type = params.type;
        this.value = params.value
        this.values = params.values;
        this.isDisable = params.isDisable;
        this.isRequired = params.isRequired;
        this.telegram = params.telegram;
    }

    public toJSON() {
        return {
            id: this.id,
            code: this.code,
            title: this.title,
            description: this.description,
            groupId: this.groupId,
            type: this.type,
            value : this.value, 
            values: this.values,
        }
    }
}