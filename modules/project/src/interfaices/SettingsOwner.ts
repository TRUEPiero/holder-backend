import { Setting } from "@schemas/common";
import { UserEntity } from "../../../auth/src/modules/user/entities/User";
import { SettingTargets } from "../modules/settings/types";

export interface SettingsOwner {
    getById(id: number, user: UserEntity, parentId?: number): Promise<SettingTarget>;
    getSettingTarget(): SettingTargets;
    createOrUpdateSetting(id: number, user: UserEntity, data: any[]): any,
}

export interface SettingTarget {
    getSettings(): Setting[]
}