import { Setting } from "@schemas/common";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { SettingsOwner } from "../../../interfaces/SettingsOwner";
import { SettingEntity } from "../entities/Setting";
import { SettingRepository } from "../repositories/setting";
import { GetSettingFilter } from "../types";

export class SettingService {
    constructor(
        private repo: SettingRepository,
        private entityService: SettingsOwner
    ) {}

    public async getById(id: number, entityId: number, user: UserEntity) {
        const setting = await this.mergedSettings(entityId, user, {id});
        return setting[0];
    }

    public async getAll(entityId: number, user: UserEntity, parentId?: number) {
        const settings = await this.mergedSettings(entityId, user, {}, parentId);
        return settings.map(s => s.response())
    }

    public async getByGroup(entityId: number, groupId: number, user: UserEntity, parentId?: number) {
        const filter: GetSettingFilter = {groupId}

        const settings = await this.mergedSettings(entityId, user, filter, parentId);
        return settings.map(s => s.response())
    }

    public async getForTelegram(entityId: number, user: UserEntity) {
        const filter: GetSettingFilter = {
            isTelegram: true
        }

        return await this.mergedSettings(entityId, user, filter);
    }

    public async update(entityId: number, user: UserEntity, data: any, parentId?: number) {
        await this.entityService.createOrUpdateSetting(entityId, user, data, parentId);
        const settings = await this.mergedSettings(entityId, user, {}, parentId);
        return settings.map(s => s.response())
    }

    private async getTargetSettings(filter: GetSettingFilter) {
        const target = this.entityService.getSettingTarget();
        const settings = await this.repo.findByFilter({
            ...filter,
            OR: [
                {target},
                {group: {target}}
            ]
        });

        return settings
    }

    private async getEntitySettings(entityId: number, user: UserEntity, parentId?: number) {
        const entity = await this.entityService.getById(entityId, user, parentId);
        const settings: Setting[] = entity.getSettings();

        return settings;
    }

    private async mergedSettings(entityId: number, user: UserEntity, filter: GetSettingFilter, parentId?: number) {
        const targetSettings = await this.getTargetSettings(filter);
        const entitySettings = await this.getEntitySettings(entityId, user, parentId);

        const map = new Map(
            entitySettings.map(s => [s.settingId, s])
        );
        
        return targetSettings.map(setting => {
            const entitySetting = map.get(setting.getId());

            if (!entitySetting) return setting;

            return new SettingEntity({
                ...setting,
                value: entitySetting.value
            });
        });
    }
}