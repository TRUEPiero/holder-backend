import { Entity } from "../../../../../project/src/interfaces/Entity";
import { hashPassword } from "../../../lib/password";

export class UserEntity extends Entity{
    private name: string;   
    private password: string;
    private status: string;   
    private email: string; 
    private telegram: any;
    private telegramId: any;

    constructor(params: any) {
        super(params)
        this.name = params.name
        this.password = params.password
        this.status = params.status
        this.email = params.email
        this.telegram = params.telegram
        this.telegramId = params.telegramId
    }

    public getName() {
        return this.name
    }

    public getEmail() {
        return this.email
    }

    public getTelegram() {
        return this.telegram
    }

    public getPassword() {
        return this.password;
    }

    public async update(data: any) {
        if(data.name) this.name = data.name;
        if(data.telegramId) this.telegramId = data.telegramId;
        if(data.telegram) this.telegram = data.telegram;
        if(data.password) this.password = await hashPassword(data.password);
    }

    public response() {
        return {
            id: this.id,
            name: this.name,
            status: this.status,
            email: this.email,
            password: this.password,
            telegram: this.telegram,
            telegramId: this.telegramId,
        }
    }
}