import { MembershipRepository } from "../repositories/membership";

export class MembershipService {

    constructor(private repo: MembershipRepository) {};

    public async getById(id: number) {
        const member = await this.repo.findById(id);
        if(!member) throw new Error("MEMBER_NOT_FOUND");
        return member;
    }

    public async addMemberToProject(projectId: number, user: any) {
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

    public async setRole(projectId: number, memberId: number, newRole: any) {
        const member = await this.getById(memberId);
        member.setRole(newRole);

        const updated = member.setRole(newRole);

        return this.repo.update(memberId, updated);
    }
    
    public async delete(projectId: number, userId: number) {

    }

}