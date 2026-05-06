import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { MemberRoles } from "../types";

export class MemberEntity {
    public id: number
    public projectId: number
    public userId: number
    public user: UserEntity
    public role: MemberRoles
    public isDeleted: boolean;
    public joinedAt: Date

    constructor(params: any) {
        this.id = params.id;
        this.projectId = params.projectId;
        this.userId = params.userId;
        this.user = params.user || undefined;
        this.role = params.role;
        this.isDeleted = params.isDeleted;
        this.joinedAt = params.joinedAt;
    }

    public update(data: any) {
        this.setRole(data.role);

        return this.toJSON();
    }

    private setRole(role: any) {
        this.role = role;
    }

    public toJSON() {
        return {
            id: this.id,
            projectId: this.projectId,
            userId: this.userId,
            role: this.role,
            joinedAt: this.joinedAt,
        }
    }
}