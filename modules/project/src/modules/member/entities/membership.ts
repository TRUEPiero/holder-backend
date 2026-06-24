import { Entity } from "../../../interfaces/Entity";
import { MemberRole, User } from "../types";

export class MemberEntity extends Entity {
    private projectId: number
    private userId: number
    private user: User
    private roleId: number
    private role: MemberRole
    private isDeleted: boolean;
    private joinedAt: Date

    constructor(params: any) {
        super(params)
        this.projectId = params.projectId;
        this.userId = params.userId;
        this.user = params.user || undefined;
        this.roleId = params.roleId;
        this.role = params.role;
        this.isDeleted = params.isDeleted;
        this.joinedAt = params.joinedAt;
    }

    public getUser() {
        return this.user
    }

    public getRole() {
        return this.role
    }

    public getIsDeleted() {
        return this.isDeleted
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
            user: this.user,
            roleId: this.roleId,
            role: this.role,
            joinedAt: this.joinedAt,
        }
    }
}