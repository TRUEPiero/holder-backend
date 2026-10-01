import { DirectoryService } from "@services/DirectoryService";
import { UserEntity } from "./entities/User";
import { CreateData, UpdateDataRepo } from "./types";
import { AlreadyExistError } from "@common/errors";

export class UserRepository {
    constructor(private base: DirectoryService<'user'>) {}

    public async findDetailed(id: number) {
        const data = await this.base.getFirstByFields(
            { id },
            { settings: true }
        );
        
        return data ? new UserEntity(data) : null;
    }

    public async findByFilter(filter: any) {
        const data = await this.base.getFirstByFields(filter);
        return data ? new UserEntity(data) : null;
    }

    public async create(data: CreateData) {
        const created = await this.base.createItem(data);
        return new UserEntity(created);
    }

    public async update(id: number, data: UpdateDataRepo) {
        const updated = await this.base.updateItem(id, data);
        return new UserEntity(updated);
    }

    public async linkTelegramIfUnlinked(id: number, telegramId: string, telegram?: string) {
        try {
            const users = await this.base.client!.user.updateManyAndReturn({
                where: { id, telegramId: null },
                data: { telegramId, telegram: telegram ?? null },
            });
            return users.length ? this.findDetailed(id) : null;
        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
                throw new AlreadyExistError('TELEGRAM_LINK');
            }
            throw error;
        }
    }
}
