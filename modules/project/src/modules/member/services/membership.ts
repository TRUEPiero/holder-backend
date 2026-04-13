import { MembershipRepository } from "../repositories/membership";

export class MembershipService {

    constructor(private repo: MembershipRepository) {};

    public async addMemberToProject(projectId: number, user: any) {
        const exist = await this.repo.getMembershipByFilter({projectId, userId: user.id})
        if(exist) throw new Error('MEMBER_ALREADY_EXIST');

        const member = await this.repo.create({
            projectId,
            userId: user.id,
            role: 'editor'
        })
        if(!member) throw new Error('MEMBER_NOT_CREATED')
        return member
    }

    public deleteMember(projectId: number, userId: number) {

    }

}