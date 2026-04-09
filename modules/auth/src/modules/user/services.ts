import { UserRepository } from "./repository";

export class UserService{
    
    constructor(private repo: UserRepository) {}

    public async getUser(id: number) {
        const user = await this.repo.findById(id);
        if(!user) throw new Error("USER_NOT_FOUND");
        return user;
    }

    public async getUserByEmail(email: string) {
        const user = await this.repo.findByEmail(email);
        if(!user) throw new Error("USER_NOT_FOUND");
        return user;
    }

    public async getTelegramUser(telegram: string) {
        const user = await this.repo.findByEmail(telegram);
        if(!user) throw new Error("USER_NOT_FOUND");
        return user
    }

    public async updateUser(user: any, data: any) {
        if(!user) throw new Error("USER_NOT_FOUND");
        user.update(data)

        return await this.repo.update(user.id, user.toJSON());
    }
}
