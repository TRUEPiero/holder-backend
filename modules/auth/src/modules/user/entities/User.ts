export class UserEntity {
    public id: number;
    public name: string;   
    public password: string;
    public role: string;   
    public email: string; 
    public telegram: any;
    public telegramId: any;

    constructor(params: any) {
        this.id = params.id;
        this.name = params.name
        this.password = params.password
        this.role = params.role
        this.email = params.email
        this.telegram = params.telegram
        this.telegramId = params.telegramId
    }

    public async update(data: any) {
        if(data.name) this.name = data.name;
        if(data.telegram) this.telegram = data.telegram;
        if(data.password) this.password = await Bun.password.hash(data.password);
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            password: this.password,
            role: this.role,
            email: this.email,
            telegram: this.telegram,
            telegramId: this.telegramId,
        }
    }
}