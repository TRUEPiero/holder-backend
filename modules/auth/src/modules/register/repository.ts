import { DirectoryService } from "@shared/DirectoryService";
import { RegisterEntity } from "./entities/Register";

export class RegisterRepository {
    constructor(private base: DirectoryService<'registerVerify'>) {}

    public async getByFilter(filter: any) {
        const data = await this.base.getByFields(filter);
        return new RegisterEntity(data);
    }

    public async create(data: any) {
        const created = await this.base.createItem(data);
        return new RegisterEntity(created);
    }

    public async update(filter: any, data: any) {
        const updated = await this.base.updateByFields(filter, data);
        return new RegisterEntity(updated);
    }
}