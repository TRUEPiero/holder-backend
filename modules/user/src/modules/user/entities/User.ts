import { Entity, SettingTarget } from "../../../../../project/src/interfaces/Entity";
import { hashPassword } from "../../../lib/password";
import { EntityParams, UpdateData, UpdateDataRepo } from "../types";

export class UserEntity extends SettingTarget {
    private name: string;   
    private password: string;
    private status: string;   
    private email: string; 
    private telegram: string;
    private telegramId: string;

    constructor(params: EntityParams) {
        super(params)
        this.name = params.name
        this.password = params.password
        this.status = params.status
        this.email = params.email
        this.telegram = params.telegram
        this.telegramId = params.telegramId
        this.settings = params.settings || []
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

    public getTelegramId() {
        return this.telegramId
    }

    public getPassword() {
        return this.password;
    }

    public getLocale(): string {
        const localeSetting = this.getSettingByCode('locale');
        return localeSetting ? localeSetting.value as string : 'ru';
    }

    public async update(data: UpdateData): Promise<UpdateDataRepo> {
        if(data.name) this.name = data.name;
        if(data.password) this.password = await hashPassword(data.password);

        return {
            name: this.name,
            password: this.password,
        }
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
            settings: this.formatSettings()
        }
    }
}
