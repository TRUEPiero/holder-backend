export class ProjectEntity {
    public id: number;
    public title: string;
    public default: boolean;
    public parameters: any;
    public ownerId: number;
    public createdAt: Date;
    public updatedAt: Date;
    public members: any[];
    public cashboxes: any[];
    
    constructor(params: any) {
        this.id = params.id;
        this.title = params.title;
        this.default = params.default;
        this.parameters = JSON.parse(params.parameters);
        this.ownerId = params.ownerId;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.members = params.members || [];
        this.cashboxes = params.cashboxes || [];
    }
}