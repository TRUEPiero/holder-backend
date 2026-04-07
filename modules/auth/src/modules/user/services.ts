import { UserRepository } from "./repository";

export class UserService{
    
    constructor(private repo: UserRepository) {}

    async getUser(id: number) {
        const user = await this.repo.findById(id);
        if(!user) throw new Error("USER_NOT_FOUND");
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.repo.findByEmail(email);
        if(!user) throw new Error("USER_NOT_FOUND");
        return user;
    }

    async updateUser(user: any, data: any) {
        if(!user) throw new Error("USER_NOT_FOUND");
        user.update(data)

        return await this.repo.update(user.id, user.toJSON());
    }
}
