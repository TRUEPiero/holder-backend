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
        const createData = {
            ...data,
            password: await Bun.password.hash(data.password)
        }

        const created = await this.repo.create(createData);
        if(!created) throw new NotCreatedError('USER');

        return created;
    }

    public async updateUser(user: any, data: any) {
        user.update(data)

        const updateData = {
            ...user.toJSON(),
            password: user.getPassword()
        }

        const updated = await this.repo.update(user.id, updateData);
        
        if(!updated) throw new NotUpdatedError('USER');

        return updated;
    }
}
