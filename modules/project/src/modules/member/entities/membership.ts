import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { Entity } from "../../../interfaices/Entity";
import { MemberRole } from "../types";

export class MemberEntity extends Entity {
    private projectId: number
    private userId: number
    private user: UserEntity
    private role: MemberRole
    private isDeleted: boolean;
    private joinedAt: Date

    public getUser() {
        return this.user
    }

    public getRole() {
        return this.role
    }

    public getIsDeleted() {
        return this.isDeleted
    }

    constructor(params: any) {
        super(params)
        this.projectId = params.projectId;
        this.userId = params.userId;
        this.user = params.user || undefined;
        this.role = params.role;
        this.isDeleted = params.isDeleted;
        this.joinedAt = params.joinedAt;
    }

    public update(data: any) {
        return {
            roleId: data.roleId
        };
    }

    public response() {
        return {
            id: this.id,
            projectId: this.projectId,
            userId: this.userId,
            role: this.role,
            joinedAt: this.joinedAt,
        }
    }
}