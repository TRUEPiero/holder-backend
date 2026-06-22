import { Entity } from "../../../interfaces/Entity";

export class InviteEntity extends Entity {
    public email: string;
    public code: string;
    public projectId: number;
    public expiredAt: Date;

    constructor(params: any) {
        super(params)
        this.code = params.code;
        this.projectId = params.projectId;
        this.email = params.email;
        this.expiredAt = params.expiredAt;
    }

    public getEmail() {
        return this.email;
    }

    public isActive() {
        return this.expiredAt > new Date();
    }

    public setChecked(date?: Date) {
        this.expiredAt = date ?? new Date();
    }

    public response() {
        return {
            id: this.id,
            email: this.email,
            code: this.code,
            expiredAt: this.expiredAt,
        }
    }
}