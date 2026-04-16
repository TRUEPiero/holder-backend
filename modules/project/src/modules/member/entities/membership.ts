import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";

export class MemberEntity {
    public id: number
    public projectId: number
    public userId: number
    public user: UserEntity
    public role: any

    constructor(params: any) {
        this.id = params.id;
        this.projectId = params.projectId;
        this.userId = params.userId;
        this.user = params.user;
        this.role = params.role;
    }

    public update(data: any) {
        
    }

    private setRole(role: any) {
        this.role = role;
    }
}