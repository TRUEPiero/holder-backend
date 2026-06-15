import { Setting } from "@schemas/common";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { SettingsOwner } from "../../../interfaices/SettingsOwner";
import { SettingEntity } from "../entities/Setting";
import { SettingRepository } from "../repositories/setting";
import { GetSettingFilter } from "../types";

export class SettingService {
    constructor(
        private repo: SettingRepository,
        private entityService: SettingsOwner
    ) {}

    public async getById(id: number, entityId: number, user: UserEntity) {
        const setting = await this.getTargetSettings(entityId, user, {id});

        return setting[0];
    }

    public async getAll(entityId: number, user: UserEntity) {
        const settings = await this.getTargetSettings(entityId, user, {});
        return settings.map(s => s.response())
    }

    public async getByGroup(entityId: number, groupId: number, user: UserEntity) {
        const filter: GetSettingFilter = {groupId}

        const settings = await this.getTargetSettings(entityId, user, filter);
        return settings.map(s => s.response())
    }

    public async getForTelegram(entityId: number, user: UserEntity) {
        const filter: GetSettingFilter = {
            isTelegram: true
        }

        return await this.getTargetSettings(entityId, user, filter);
    }

    public async update(entityId: number, user: UserEntity, data: any) {
        await this.entityService.createOrUpdateSetting(entityId, user, data);
        const settings = await this.getTargetSettings(entityId, user, {});
        return settings.map(s => s.response())
    }

    private async getTargetSettings(entityId: number, user: UserEntity, filter: GetSettingFilter) {
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

    private async getEntitySettings(entityId: number, user: UserEntity, parentId?: number) {
        const entity = await this.entityService.getById(entityId, user, parentId);
        const entitySettings: Setting[] = entity.getSettings();

        return entitySettings;
    }

    private async mergeWithEntitySettings(entityId: number, user: UserEntity, defaultSettings: SettingEntity[], parentId?: number) {
        const entitySettings = await this.getEntitySettings(entityId, user, parentId);

        const map = new Map(
            entitySettings.map(s => [s.settingId, s])
        );
        
        return defaultSettings.map(setting => {
            const entitySetting = map.get(setting.getId());

            if (!entitySetting) return setting;

            return new SettingEntity({
                ...setting,
                value: entitySetting.value
            });
        });
    }
}