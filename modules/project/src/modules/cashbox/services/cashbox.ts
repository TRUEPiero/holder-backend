import { PaginationParam } from "@shared-types/index.ts";
import { ProjectService } from "../../project/services";
import { CashboxRepository } from "../repositories/cashbox";
import { SettingsOwner } from "../../../interfaces/SettingsOwner";
import { SettingTargets } from "@shared-types/index.ts";
import { InvalidFieldError, NotCreatedError, NotDeletedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { CasheService } from "@services/CasheService";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { CRUD } from "../../../interfaces/Crud";

export class CashboxService extends CRUD implements SettingsOwner{

    constructor(
        private repo: CashboxRepository,
        private projectService: ProjectService,
        private cashe: CasheService
    ) {
        super()
    }

    public async getById(id: number, user: UserEntity, projectId: number) {
        if(!id) throw new InvalidFieldError("ID");

        await this.projectService.authorize(projectId, user, 'cashbox:read')
        
        const cashbox = await this.repo.findDetailed({id, projectId});
        if (!cashbox) throw new NotFoundError("CASHBOX");
        return cashbox;
    }

    public async getByProject(projectId: number, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'cashbox:read');

        const cashboxes = await this.repo.findByProject(projectId);
        return cashboxes.map(c => c.response())
    }

    public async getWithPagination(parameters: PaginationParam) {
        const cashbox = await this.repo.findWithPagination(parameters);
        return cashbox;
    }

    public async create(user: UserEntity, body: any, projectId: number) {
        await this.projectService.authorize(projectId, user, 'cashbox:create');

        const createData = { 
            projectId, 
            ...body,
            description: body.desciption ?? '',
        };

        const created = await this.repo.create(createData);
        if(!created) throw new NotCreatedError("CASHBOX")

        await this.cashe.del(`project:${projectId}`);

        return created;
    }

    public async update(id: number, user: UserEntity, data: any, projectId: number) {
        await this.projectService.authorize(projectId, user, 'cashbox:update');

        const cashbox = await this.getById(id, user, projectId);
        const updated = cashbox.update(data);

        const res = await this.repo.update(id, updated);
        if(!res) throw new NotUpdatedError("CASHBOX")
        
        await this.cashe.del(`project:${projectId}`);
        
        return res;
    }

    public async delete(id: number, user: UserEntity, projectId: number) {
        await this.projectService.authorize(projectId, user, 'cashbox:delete');

        await this.getById(id, user, projectId); 
        const deleted = await this.repo.delete(id);
        if(!deleted) throw new NotDeletedError("CASHBOX")
        
        await this.cashe.del(`project:${projectId}`);
        
        return deleted;
    }

    public getSettingTarget(): SettingTargets {
        return 'cashbox'
    }
}
