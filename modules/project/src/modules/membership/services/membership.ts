import { DirectoryService } from "@shared/DirectoryService";

export class MembershipService extends DirectoryService<'projectMembership'> {

    constructor() {
        super('projectMembership', [])
    };

    public addMember(projectId: number, userId: number) {

    }

    public deleteMember(projectId: number, userId: number) {

    }

}