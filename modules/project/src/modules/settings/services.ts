import { SettingsOwner } from "../../interfaices/SettingsOwner";
import { SettingEntity } from "./entities/Setting";
import { SettingRepository } from "./repository";
import { EntitySetting, GetSettingFilter } from "./types";

export class SettingService {
    constructor(
        private repo: SettingRepository,
        private entityService: SettingsOwner
    ) {}

    public async getById(id: number, entityId: number) {
        const setting = await this.getSettings(entityId, {id});

        return setting[0];
    }

    public async getAll(entityId: number) {
        return await this.getSettings(entityId, {});
    }

    public async getByGroup(entityId: number, groupId: number) {
        const filter = {groupId}

        return await this.getSettings(entityId, filter);
    }

    public async getForTelegram(entityId: number) {
        const filter:GetSettingFilter = {
            isTelegram: true
        }

        return await this.getSettings(entityId, filter);
    }

    private async getSettings(entityId: number, filter: GetSettingFilter) {
        const target = this.entityService.getSettingTarget();
        const settings = await this.repo.findByFilter({
            ...filter,
            target
        });

        return await this.mergeWithEntitySettings(entityId, settings);
    }

    private async mergeWithEntitySettings(entityId: number, defaultSettings: SettingEntity[]) {
        const entity = await this.entityService.getById(entityId);
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