export class ProjectEntity {
    private readonly id: number;
    private title: string;
    private default: boolean;
    private settings: Record<string, any>[];
    private ownerId: number;
    private members: any[];
    private cashboxes: any[];
    
    constructor(params: any) {
        this.id = params.id;
        this.title = params.title;
        this.default = params.default;
        this.settings = params.settings;
        this.ownerId = params.ownerId;
        this.members = params.members;
        this.cashboxes = params.cashboxes;
    }
    
    public getJSON() {
        return {
            id: this.id,
            title: this.title,
            default: this.default,
            settings: this.settings,
            ownerId: this.ownerId,
            members: this.members,
            cashboxes: this.cashboxes,
        }
    }

    public getSettings() {
        return this.settings;
    }

    public update(data: any): ProjectEntity {
        const {settings, ...dataWithoutParams} = data;
        
        for(const [key, value] of Object.entries(dataWithoutParams)) {
            if(value) this[key] = value
        }

        this.setParameters(settings);

        return this;
    }
    
    private setParameters(newParams: any) {
        const preparedParams = newParams;
        this.settings = preparedParams;
    }
    
}