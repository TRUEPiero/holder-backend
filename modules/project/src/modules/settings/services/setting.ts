import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { SettingsOwner } from "../../../interfaices/SettingsOwner";
import { SettingEntity } from "../entities/Setting";
import { SettingRepository } from "../repositories/setting";
import { EntitySetting, GetSettingFilter } from "../types";

export class SettingService {
    constructor(
        private repo: SettingRepository,
        private entityService: SettingsOwner
    ) {}

    public async getById(id: number, entityId: number, user: UserEntity) {
        const setting = await this.getSettings(entityId, user, {id});

        return setting[0];
    }

    public async getAll(entityId: number, user: UserEntity) {
        return await this.getSettings(entityId, user, {});
    }

    public async getByGroup(entityId: number, groupId: number, user: UserEntity) {
        const filter: GetSettingFilter = {groupId}

        return await this.getSettings(entityId, user, filter);
    }

    public async getForTelegram(entityId: number, user: UserEntity) {
        const filter: GetSettingFilter = {
            isTelegram: true
        }

        return await this.getSettings(entityId, user, filter);
    }

    private async getSettings(entityId: number, user: UserEntity, filter: GetSettingFilter) {
        const target = this.entityService.getSettingTarget();
        const settings = await this.repo.findByFilter({
            ...filter,
            OR: [
                {target},
                {group: {target}}
            ]
        });

        return await this.mergeWithEntitySettings(entityId, user, settings);
    }

    private async mergeWithEntitySettings(entityId: number, user: UserEntity, defaultSettings: SettingEntity[]) {
        const entity = await this.entityService.getById(entityId, user);
        const entitySettings: EntitySetting[] = entity.getSettings();

        const map = new Map(
            entitySettings.map(s => [s.code, s])
        );

        return defaultSettings.map(setting => {
            const entitySetting = map.get(setting.code);

            if (!entitySetting) return setting;

            return new SettingEntity({
                ...setting,
                value: entitySetting.value
            });
        });
    }
}