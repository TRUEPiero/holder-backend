import { NotCreatedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserRepository } from "./repository";
import { UserEntity } from "./entities/User";

type TelegramFilter = {
    telegramId?: number | string,
    telegram?: string
}

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

    public async getTelegramUser(params: TelegramFilter) {
        const {telegramId, telegram} = params;

        const filter = {
            OR: [
                {telegramId},
                {telegram}
            ],
            
        }

        const user = await this.repo.findByFilter(filter);
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

    public async update(user: UserEntity, data: any) {
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
