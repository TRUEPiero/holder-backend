import { UserEntity } from "../../../../../user/src/modules/user/entities/User";
import { UserSettingRepository } from "../repositories/user";

export class UserSettingValuesService {
    constructor(
        private repo: UserSettingRepository,
    ) { }

    public async createOrUpdateSetting(id: number, user: UserEntity, data: any[]): Promise<any[]> {
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

        return settings;
    }
}