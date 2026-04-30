export class UserEntity {
    public id: number;
    public name: string;   
    public password: string;
    public status: string;   
    public email: string; 
    public telegram: any;
    public telegramId: any;

    constructor(params: any) {
        this.id = params.id;
        this.name = params.name
        this.password = params.password
        this.status = params.status
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
            status: this.status,
            email: this.email,
            telegram: this.telegram,
            telegramId: this.telegramId,
        }
    }

    public getPassword() {
        return this.password;
    }
}