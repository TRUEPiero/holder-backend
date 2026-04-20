import { CashboxEntity } from "../modules/cashbox/entities/Cashbox";
import { ProjectEntity } from "../modules/project/entities/Project";
import { SettingTargets } from "../modules/settings/types";

export interface SettingOwner {
    getById(id: number): Promise<ProjectEntity|CashboxEntity>;
    getSettingTarget(): SettingTargets
}