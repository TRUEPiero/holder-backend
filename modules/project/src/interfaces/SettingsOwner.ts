import { UserEntity } from "../../../auth/src/modules/user/entities/User";
import { SettingTargets } from "@shared-types/index.ts";
import { SettingTarget } from "./Entity";

export interface SettingsOwner {
    getById(id: number, user: UserEntity, parentId?: number): Promise<SettingTarget>;
    getSettingTarget(): SettingTargets;
    createOrUpdateSetting(id: number, user: UserEntity, data: any[], parentId?: number): any,
}