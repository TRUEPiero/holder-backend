type SettingType  = 'enum' | 'string' | 'number' | 'boolean' | 'float';

export class SettingEntity {
    public id: number;
    public code: string;
    public description: string;
    public groupId: number;
    public type: SettingType;
    public value: any;
    public values: any[];

    constructor(params: any) {
        this.id = params.id;
        this.code = params.code;
        this.description = params.description;
        this.groupId = params.groupId;
        this.type = params.type;
        this.value = params.value
        this.values = params.values;
    }

    public toJSON() {
        return {
            id: this.id,
            code: this.code,
            description: this.description,
            groupId: this.groupId,
            type: this.type,
            value : this.value, 
            values: this.values,
        }
    }
}