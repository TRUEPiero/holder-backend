import { CasheService } from "@services/CasheService";
import { CashboxSettingRepository } from "../repositories/cashbox";
import { ProjectService } from "../../project/services";
import { UserEntity } from "../../../../../user/src/modules/user/entities/User";

export class CashboxSettingValuesService {
    constructor(
        private repo: CashboxSettingRepository,
        private projectService: ProjectService,
        private cashe: CasheService
    ) { }

    public async createOrUpdateSetting(id: number, user: UserEntity, data: any[], parentId: number): Promise<any[]> {
        await this.projectService.authorize(parentId, user, ['cashbox:update', 'settings:update']);

        const settings = [];
        for (const setting of data) {
            const filter = {
                cashboxId_settingId: {
                    cashboxId: id,
                    settingId: setting.id
                }
            }

            const create = {
                cashboxId: id,
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

        await this.cashe.del(`project:${parentId}`)

        return settings;
    }
}