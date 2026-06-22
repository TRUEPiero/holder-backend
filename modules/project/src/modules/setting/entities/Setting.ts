import { Entity } from "../../../interfaces/Entity";
import { SettingTypes } from "../types";

export class SettingEntity extends Entity{
    private code: string;
    private title: string;
    private description: string;
    private groupId: number;
    private type: SettingTypes;
    private value: any;
    private values: any[];
    private isDisabled: boolean;
    private isRequired: boolean;
    private isTelegram: boolean;


    constructor(params: any) {
        super(params);
        this.code = params.code;
        this.title = params.title;
        this.description = params.description || '';
        this.groupId = params.groupId;
        this.type = params.type;
        this.value = params.value
        this.values = params.values;
        this.isDisabled = params.isDisabled;
        this.isRequired = params.isRequired;
        this.isTelegram = params.isTelegram;
    }

    public getTitle() {
        return this.title
    }
    
    public getType() {
        return this.type;
    }

    public response() {
        return {
            id: this.id,
            code: this.code,
            title: this.title,
            description: this.description,
            groupId: this.groupId,
            type: this.type,
            value : this.value, 
            values: this.values,
            isDisabled: this.isDisabled,
            isRequired: this.isRequired,
            isTelegram: this.isTelegram,
        }
    }
}