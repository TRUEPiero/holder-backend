import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { SettingsOwner } from "../../../interfaices/SettingsOwner";
import { SettingGroupRepository } from "../repositories/group";

export class SettingGroupService {
    constructor(
        private repo: SettingGroupRepository,
        private entityService: SettingsOwner
    ) {}

    public async getAll(entityId: number, user: UserEntity) {
        return await this.getGroups(entityId, user, {});
    }

    private async getGroups(entityId: number, user: UserEntity, filter: any) {
        const target = this.entityService.getSettingTarget();
        const groups = await this.repo.findByFilter({
            ...filter,
            target
        });

        return groups;
    }   
}