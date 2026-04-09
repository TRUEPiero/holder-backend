type SettingType  = 'enum' | 'string' | 'number' | 'boolean';

export class SettingEntity {
    public id: number;
    public code: string;
    public description: string;
    public groupId: number;
    public type: SettingType;
    public values: any[];

    constructor(params: any) {
        this.id = params.id;
        this.code = params.code;
        this.description = params.description;
        this.groupId = params.groupId;
        this.type = params.type;
        this.values = params.values;
    }
}