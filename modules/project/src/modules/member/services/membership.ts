import { AlreadyExistError, NotCreatedError, NotDeletedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";
import { MembershipRepository } from "../repositories/membership";
import { CasheService } from "@services/CasheService";
import { MemberRoleService } from "./role";
import { CRUD } from "../../../interfaces/Crud";

export class MembershipService extends CRUD{

    constructor(
        private repo: MembershipRepository,
        private projectService: ProjectService,
        private memberRoleService: MemberRoleService,
        private cashe: CasheService
    ) {
        super()
    };

    public async getById(id: number) {
        const member = await this.repo.findById(id);
        if(!member) throw new NotFoundError("MEMBER");
        return member;
    }

    public async getByUser(user: UserEntity) {
        const member = await this.repo.findByFilter({userId: user.getId()});
        if(!member) throw new NotFoundError("MEMBER");
        return member;
    }

    public async getWithPagination(parameters: any) {
        const members = await this.repo.findWithPagination(parameters);
        return members;
    }

    public async create(user: UserEntity, data: any, projectId: number) {
        const exist = await this.repo.findByFilter({projectId, userId: user.getId()})
        if(exist) {
            if(!exist.getIsDeleted()) throw new AlreadyExistError('MEMBER');

            const updateData = {
                isDeleted: false
            }

            const updated = await this.repo.update(exist.getId(), updateData);
            if(!updated) throw new NotCreatedError('MEMBER');

            await this.cashe.del(`project:${projectId}`);

            return updated;
        };

        const defaultRole = await this.memberRoleService.getDefault();

        const member = await this.repo.create({
            projectId,
            userId: user.getId(),
            roleId: defaultRole.id
        })
        if(!member) throw new NotCreatedError('MEMBER');

        await this.cashe.del(`project:${projectId}`);

        const detail = await this.getById(member.getId());
        return detail;
    }

    public async update(memberId: number, user: UserEntity, data: any, projectId: number) {
        await this.projectService.authorize(projectId, user, 'member:update');

        const member = await this.repo.findByFilter({id: memberId, projectId});
        if(!member) throw new  NotFoundError("MEMBER");

        const updated = member.update(data);

        const res = await this.repo.update(memberId, updated);
        if(!res) throw new NotUpdatedError("MEMBER");
        
        await this.cashe.del(`project:${projectId}`);
        
        const detail = await this.getById(res.getId());
        return detail;
    }
    
    public async delete(memberId: number, user: UserEntity, projectId: number, ) {
        await this.projectService.authorize(projectId, user, 'member:delete');

        const member = await this.repo.findByFilter({id: memberId, projectId});
        if(!member) throw new  NotFoundError("MEMBER");

        const deleteData = {
            isDeleted: true
        }

        const deleted = await this.repo.softDelete(memberId, deleteData);
        if(!deleted) throw new NotDeletedError("MEMBER");

        await this.cashe.del(`project:${projectId}`);

        return deleted;
    }
}