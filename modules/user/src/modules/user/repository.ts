import { DirectoryService } from "@services/DirectoryService";
import { UserEntity } from "./entities/User";
import { CreateData, UpdateDataRepo } from "./types";

export class UserRepository {
    constructor(private base: DirectoryService<'user'>) {}

    public async findById(id: number) {
        const data = await this.base.getById(id);
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
}