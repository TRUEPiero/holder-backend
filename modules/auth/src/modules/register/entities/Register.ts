export class RegisterEntity {
    public id: number;
    public email: string;
    public code: string;
    public expiredAt: Date;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(params: any) {
        this.id = params.id;
        this.code = params.code;
        this.email = params.email;
        this.expiredAt = params.expiredAt;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }

    public isActive() {
        return this.expiredAt > new Date();
    }

    public setChecked(date?: Date) {
        this.expiredAt = date ?? new Date();
    }

    public toJSON() {
        return {
            id: this.id,
            email: this.email,
            code: this.code,
            expiredAt: this.expiredAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        }
    }
}