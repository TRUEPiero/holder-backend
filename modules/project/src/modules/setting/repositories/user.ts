import { DirectoryService } from "@services/DirectoryService";

export class UserSettingRepository {
    constructor (
        private base: DirectoryService<'userSettings'>
    ) {}

    public async createOrUpdate(filter: any, create: any, update: any) {
        const data = await this.base.upsert(filter, create, update);
        return data;        
    }
}