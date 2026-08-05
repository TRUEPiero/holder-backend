import { Entity } from "../../../../../project/src/interfaces/Entity";
import { EntityParams } from "../types";

export class RegisterEntity extends Entity {
    private email: string;
    private code: string;
    private isChecked: boolean;
    private verifyToken: string;
    private expiredAt: Date;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(params: EntityParams) {
        super(params);
        this.id = params.id;
        this.code = params.code;
        this.verifyToken = params.verifyToken;
        this.email = params.email;
        this.isChecked = params.isChecked;
        this.expiredAt = params.expiredAt;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }

    public getEmail() {
        return this.email;
    }

    public isActive() {
        return this.expiredAt > new Date();
    }

    public checked() {
        return this.isChecked;
    }

    public getExpiredAt() {
        return this.expiredAt
    }

    public setChecked(date?: Date) {
        this.expiredAt = date ?? new Date();
        this.isChecked = true
    }

    public response() {
        return {
            id: this.id,
            email: this.email,
            code: this.code,
            verifyToken: this.verifyToken,
            expiredAt: this.expiredAt,
            isChecked: this.isChecked,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}