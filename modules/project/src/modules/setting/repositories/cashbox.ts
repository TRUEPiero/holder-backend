import { DirectoryService } from "@services/DirectoryService";

export class CashboxSettingRepository {
    constructor (
        private base: DirectoryService<'cashboxSettings'>
    ) {}

    public async createOrUpdate(filter: any, create: any, update: any) {
        const data = await this.base.upsert(filter, create, update);
        return data;        
    }
}