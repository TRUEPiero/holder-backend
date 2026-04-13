export class MembershipEntity {
    public id: number;
    public projectId: number;
    public userId: number;

    constructor(params: any) {
        this.id = params.id;
        this.projectId = params.projectId;
        this.userId = params.userId;
    }


}