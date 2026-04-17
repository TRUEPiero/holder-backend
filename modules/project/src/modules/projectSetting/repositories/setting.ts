import { DirectoryService } from "@shared/DirectoryService";
import { SettingEntity } from "../entities/Setting";
import { Setting } from "../types";

export class SettingRepository {
    constructor(private base: DirectoryService<'projectSetting'>) {}

    public async findById(id: number) {
        const data = await this.base.getById(id);
        return new SettingEntity(data);
    }

    public async findByGroup(groupId: number) {
        const data = await this.base.getByFields({groupId})
        return data.map(d => new SettingEntity(d))
    }

    public async findByFilter(filter: any) {
        const data = await this.base.getByFields(filter);
        return data.map(i => new SettingEntity(i))
    }
}