import { DirectoryService } from "@services/DirectoryService";

export class SettingGroupRepository {
    constructor (
        private base: DirectoryService<'settingGroup'>
    ) {}

    public async findByFilter(filter: any) {
        const data = await this.base.getByFields(filter);
        return data
    }
}