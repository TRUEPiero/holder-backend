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

    public async findAll() {
        const data = await this.base.getAllWithQuery({
            include: {
            }
        });
        return data.map((s: Setting) => new SettingEntity(s))
    }
}