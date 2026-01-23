import { DirectoryService } from "@shared/DirectoryService";
import { UserService } from "../../auth/services/user";

const userService = new UserService();

export class MembershipService extends DirectoryService<'projectMembership'> {

    constructor() {
        super('projectMembership', [])
    };

    async sendInviteMessage(projectId: number, userEmail: string, status: any) {
        const user = await userService.getFirstByFields({email: userEmail});

        if(!user) return status(404, {error: 'User not found'});

        return true;
    }

    async acceptInvite(projectId: number, userId: number, status: any) {

        const member = await this.createItem({
            projectId,
            userId,
            role: "viewer"
        })

        if(!member) return status(500, {error: 'Error while adding member'})

        return member
    }

}