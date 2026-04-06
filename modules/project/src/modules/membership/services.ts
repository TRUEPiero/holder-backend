import { DirectoryService } from "@shared/DirectoryService";
import { UserService } from "../../../../auth/src/modules/user/services";

const userService = new UserService();

export class MembershipService extends DirectoryService<'projectMembership'> {

    constructor() {
        super('projectMembership', [])
    };

    public addMembership(projectId: number, userId: number) {

    }

    public deleteMembership(projectId: number, userId: number) {

    }

}