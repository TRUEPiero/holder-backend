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
        this.value = params.defaultValue
        this.values = params.values;
    }

    public getJSON() {
        return {
            id: this.id,
            code: this.code,
            description: this.description,
            groupId: this.groupId,
            type: this.type,
            value : this.prepareView(this.value), 
            values: this.prepareView(this.values),
        }
    }

    /*
    *
    */
    private prepareView(value: any | any[]) {
        if(Array.isArray(value)) {
            return value.map(i => {
                return this.getValueByType(i)
            })
        } else {
            return this.getValueByType(value);
        }
    }

    private getValueByType(value: any) {
        switch(this.type) {
            case "string":
                return value.valueString;
            case "boolean": 
                return value.valueBoolean;
            case "number": 
                return value.valueInteger;
            case "enum": 
                return value.valueString;
            case "float":
                return value.valueFloat;
        }
    }
}