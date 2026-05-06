import { UserEntity } from "../../../auth/src/modules/user/entities/User";
import { CashboxEntity } from "../modules/cashbox/entities/Cashbox";
import { ProjectEntity } from "../modules/project/entities/Project";
import { SettingTargets } from "../modules/settings/types";

export interface SettingsOwner {
    getById(id: number, user: UserEntity, projectId?: number): Promise<ProjectEntity|CashboxEntity>;
    getSettingTarget(): SettingTargets;
}