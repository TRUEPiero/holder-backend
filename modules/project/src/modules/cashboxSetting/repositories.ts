import { DirectoryService } from "@shared/DirectoryService";
import { CashboxSettingEntity } from "./entities/Setting";

export class CashboxSettingsRepository {
    constructor(private base: DirectoryService<'cashboxSetting'>) {}

    public async findById(id: number) {
        const data = await this.base.getById(id);
        return new CashboxSettingEntity(data);
    }

    public async findByGroup(groupId: number) {
        const data = await this.base.getByFields({groupId})
        return data.map(d => new CashboxSettingEntity(d))
    }

    public async findByFilter(filter: any) {
        const data = await this.base.getByFields(filter);
        return data.map(i => new CashboxSettingEntity(i))
    }
}