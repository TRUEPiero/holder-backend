import { NotCreatedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserRepository } from "./repository";

export class UserService{
    
    constructor(private repo: UserRepository) {}

    public async getUser(id: number) {
        const user = await this.repo.findById(id);
        if(!user) throw new NotFoundError('USER')
        return user;
    }

    public async getUserByEmail(email: string) {
        const filter = {
            email
        }

        const user = await this.repo.findByFilter(filter);
        if(!user) throw new NotFoundError('USER')
        return user;
    }

    public async getTelegramUser(telegram: string) {
        const filter = {
            telegram
        }

        const user = await this.repo.findByFilter(filter);
        if(!user) throw new NotFoundError('USER')
        return user
    }

    public async create(data: any) {
        const created = await this.repo.create(data);
        if(created) throw new NotCreatedError('USER');

        return created;
    }

    public async updateUser(user: any, data: any) {
        user.update(data)

        const updated = await this.repo.update(user.id, user.toJSON());
        if(!updated) throw new NotUpdatedError('USER');

        return updated;
    }
}
