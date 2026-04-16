import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";
import { MembershipRepository } from "../repositories/membership";

export class MembershipService {

    constructor(
        private repo: MembershipRepository,
        private projectService: ProjectService,
    ) {};

    public async getById(id: number) {
        const member = await this.repo.findById(id);
        if(!member) throw new Error("MEMBER_NOT_FOUND");
        return member;
    }

    public async getWithPagination(parameters: any) {
        const members = await this.repo.findWithPagination(parameters);
        return members;
    }

    public async create(projectId: number, user: UserEntity) {
        const exist = await this.repo.findByFilter({projectId, userId: user.id})
        if(exist) throw new Error('MEMBER_ALREADY_EXIST');

        const member = await this.repo.create({
            projectId,
            userId: user.id,
            role: 'editor'
        })
        if(!member) throw new Error('MEMBER_NOT_CREATED')
        return member
    }

    public async update(projectId: number, memberId: number, data: any, user: UserEntity) {
        const project = await this.projectService.getById(projectId);

        if(!project.checkAccess(user)) {
            throw new Error("ACCESS_DENIED");
        }

        const member = await this.getById(memberId);
        const updated = member.update(data);

        return this.repo.update(memberId, updated);
    }
    
    public async delete(projectId: number, userId: number) {

    }
}