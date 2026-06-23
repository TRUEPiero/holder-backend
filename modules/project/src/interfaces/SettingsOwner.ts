import { UserEntity } from "../../../auth/src/modules/user/entities/User";
import { SettingTargets } from "@shared-types/index";
import { SettingTarget } from "./Entity";

export interface SettingsOwner {
    getById(id: number, user: UserEntity, parentId?: number): Promise<SettingTarget>;
    getSettingTarget(): SettingTargets;
}

export interface SettingsValues {
    createOrUpdateSetting(id: number, user: UserEntity, data: any[], parentId?: number): any,
}