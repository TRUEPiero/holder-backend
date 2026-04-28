import { AccessDeniedError, AlreadyExistError, NotCreatedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";
import { MembershipRepository } from "../repositories/membership";
import { CasheService } from "@services/CashService";

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

    public async getWithPagination(parameters: any) {
        const members = await this.repo.findWithPagination(parameters);
        return members;
    }

    public async create(projectId: number, user: UserEntity) {
        const exist = await this.repo.findByFilter({projectId, userId: user.id})
        if(exist) throw new AlreadyExistError('MEMBER');

        const member = await this.repo.create({
            projectId,
            userId: user.id,
            role: 'editor'
        })
        if(!member) throw new NotCreatedError('MEMBER');

        await this.cashe.del(`project:${projectId}`);

        return member
    }

    public async update(projectId: number, memberId: number, data: any, user: UserEntity) {
        await this.projectService.checkAccess(projectId, user);

        const member = await this.getById(memberId);
        const updated = member.update(data);

        const res = await this.repo.update(memberId, updated);
        if(!res) throw new NotUpdatedError("MEMBER");
        
        await this.cashe.del(`project:${projectId}`);
        
        return res; 
    }
    
    public async delete(projectId: number, userId: number) {

    }
}