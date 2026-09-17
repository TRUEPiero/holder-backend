import { DirectoryService } from "@services/DirectoryService";
import { RegisterEntity } from "./entities/Register";
import { CreateData, GetFilter, UpdateData, UpdateFilter } from "./types";

export class RegisterRepository {
    constructor(private base: DirectoryService<'registerVerify'>) {}

    public async getByFilter(filter: GetFilter) {
        const data = await this.base.getFirstByFields(filter);
        if(!data) return null;
        
        return new RegisterEntity(data);
    }

    public async create(data: CreateData) {
        const created = await this.base.createItem(data);
        return new RegisterEntity(created);
    }

    public async update(filter: UpdateFilter, data: UpdateData) {
        const updated = await this.base.updateFirstByFields(filter, data);
        if(!updated) return null;
        
        return new RegisterEntity(updated);
    }

    public async delete(id: number) {
        const deleted = await this.base.deleteItem(id);
        if(!deleted) return null;

        return new RegisterEntity(deleted);
    }
}