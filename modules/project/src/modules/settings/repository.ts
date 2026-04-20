import { DirectoryService } from "@shared/DirectoryService";
import { SettingEntity } from "./entities/Setting";

export class SettingRepository {
    constructor (
        private base: DirectoryService<'settingDefinition'>,
    ) {}

    public async findById(id: number) {
        const data = await this.base.getById(id);
        if(!data) return null;

        return new SettingEntity(data); 
    }

    public async findByFilter(filter: any) {
        const data = await this.base.getByFields(filter);
        return data.map(d => new SettingEntity(d))
    }

}