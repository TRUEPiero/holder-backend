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

    public isExpired() {
        return this.expiredAt > new Date();
    }

    public setExpiredDate() {
        this.expiredAt = new Date();
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