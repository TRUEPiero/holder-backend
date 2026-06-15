import { DirectoryService } from "@services/DirectoryService";

export class ProjectSettingRepository {
    constructor (
        private base: DirectoryService<'projectSettings'>
    ) {}

    public async createOrUpdate(filter: any, create: any, update: any) {
        const data = await this.base.upsert(filter, create, update);
        return data;        
    }
}