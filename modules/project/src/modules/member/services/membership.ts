import { AlreadyExistError, NotCreatedError, NotDeletedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";
import { MembershipRepository } from "../repositories/membership";
import { CasheService } from "@services/CasheService";

export class MembershipService {

    constructor(
        private repo: MembershipRepository,
        private projectService: ProjectService,
        private cashe: CasheService
    ) {};

    public async getById(id: number) {
        const member = await this.repo.findById(id);
        if(!member) throw new NotFoundError("MEMBER");
        return member;
    }

    public async getByUser(user: UserEntity) {
        const member = await this.repo.findByFilter({userId: user.id});
        if(!member) throw new NotFoundError("MEMBER");
        return member;
    }

    public async getWithPagination(parameters: any) {
        const members = await this.repo.findWithPagination(parameters);
        return members;
    }

    public async create(projectId: number, user: UserEntity) {
        const exist = await this.repo.findByFilter({projectId, userId: user.id})
        if(exist) {
            if(!exist.isDeleted) throw new AlreadyExistError('MEMBER');

            const updateData = {
                isDeleted: false
            }

            const updated = await this.repo.update(exist.id, updateData);
            if(!updated) throw new NotCreatedError('MEMBER');

            await this.cashe.del(`project:${projectId}`);

            return updated;
        };

        const member = await this.repo.create({
            projectId,
            userId: user.id,
            role: 'editor'
        })
        if(!member) throw new NotCreatedError('MEMBER');

        await this.cashe.del(`project:${projectId}`);

        const detail = await this.getById(member.id);
        return detail;
    }

    public async update(projectId: number, memberId: number, data: any, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'member:update');

        const member = await this.repo.findByFilter({id: memberId, projectId});
        if(!member) throw new  NotFoundError("MEMBER");

        const updated = member.update(data);

        const res = await this.repo.update(memberId, updated);
        if(!res) throw new NotUpdatedError("MEMBER");
        
        await this.cashe.del(`project:${projectId}`);
        
        const detail = await this.getById(res.id);
        return detail;
    }
    
    public async delete(projectId: number, memberId: number, user: UserEntity) {
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