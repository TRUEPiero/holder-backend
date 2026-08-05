import { CasheService } from "@services/CasheService";
import { UserEntity } from "../../../../../user/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";
import { ProjectSettingRepository } from "../repositories/project";

export class ProjectSettingValueService {
    constructor (
        private repo: ProjectSettingRepository,
        private projectService: ProjectService,
        private cashe: CasheService
    ) {}

    public async createOrUpdateSetting(id: number, user: UserEntity, data: any[]): Promise<any> {
        await this.projectService.authorize(id, user, ['project:update', 'settings:update']);

        const settings = [];
        for(const setting of data) {
            const filter = {
                projectId_settingId: {
                    projectId: id,
                    settingId: setting.id
                }   
            }

            const create = {
                projectId: id,
                settingId: setting.id,
                value: setting.value
            }

            const update = {
                settingId: setting.id,
                value: setting.value
            }

            const res = await this.repo.createOrUpdate(filter, create, update);
            settings.push(res);
        }

        await this.cashe.del(`project:${id}`)

        return settings;
    }
}