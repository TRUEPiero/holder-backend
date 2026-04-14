export class MemberEntity {
    public id: number;
    public projectId: number;
    public userId: number;
    public role: any

    constructor(params: any) {
        this.id = params.id;
        this.projectId = params.projectId;
        this.userId = params.userId;
        this.role = params.role;
    }


    public async setRole(role: any) {
        this.role = role;
    } 

}