export class InviteEntity {
    public id: number;
    public email: string;
    public code: string;
    public projectId: number;
    public expiredAt: Date;

    constructor(params: any) {
        this.id = params.id;
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

    public setExpiredDate(date?: Date) {
        this.expiredAt = date ?? new Date();
    }

    public toJSON() {
        return {
            id: this.id,
            email: this.email,
            code: this.code,
            expiredAt: this.expiredAt,
        }
    }
}