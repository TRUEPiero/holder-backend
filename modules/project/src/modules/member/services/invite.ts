import { AlreadyExistError, NotCreatedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserService } from "../../../../../auth/src/modules/user/services";
import { InviteRepository } from "../repositories/invite";
import { MembershipService } from "./membership";
import { getExpiredDate } from "../../../../../../src/helpers/expiredDate";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";

export class ProjectInviteService {
    constructor(
        private inviteRepo: InviteRepository,
        private userService: UserService,
        private memberService: MembershipService,
        private projectService: ProjectService
    ) {}

    public async getByFilter(filter: any) {
        return await this.inviteRepo.findByFields(filter);
    }

    public async sendInviteToUser(projectId: number, email: string, user: UserEntity) { 
        await this.projectService.authorize(projectId, user, 'member:invite');

        await this.userService.getUserByEmail(email);

        const invite = await this.getByFilter({email, projectId});
        if(invite && invite.isActive()) throw new AlreadyExistError("INVITE");

        const code = this.generateCode();
        const createdInvite = await this.inviteRepo.create({
            email,
            code,
            expiredAt: getExpiredDate(),
            projectId
        });

        if(!createdInvite) throw new NotCreatedError("INVITE");

        return true;
    }

    public async acceptInvite(projectId: number, code: string, user: UserEntity) {
        const invite = await this.getByFilter({code, projectId});
        if(!invite || !invite.isActive()) throw new NotFoundError("INVITE");
        if(invite.getEmail() !== user.getEmail()) throw new NotFoundError("INVITE");

        invite.setChecked();

        const updated = await this.inviteRepo.update(
            {code}, 
            invite.response()
        )
        if(!updated) throw new NotUpdatedError("INVITE");

        return await this.memberService.create(user, {}, projectId);
    }

    private generateCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }
}