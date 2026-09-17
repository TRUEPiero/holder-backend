import { UserEntity } from "../../../../../user/src/modules/user/entities/User";
import { SettingsOwner } from "../../../interfaces/SettingsOwner";
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