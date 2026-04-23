import { AlreadyExistError, NotCreatedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserService } from "../../../../../auth/src/modules/user/services";
import { InviteRepository } from "../repositories/invite";
import { MembershipService } from "./membership";

export class ProjectInviteService {
    constructor(
        private inviteRepo: InviteRepository,
        private userService: UserService,
        private memberService: MembershipService
    ) {}

    public async getInvite(filter: any) {
        return await this.inviteRepo.getByFilter(filter);
    }

    public async sendInviteToUser(projectId: number, email: string) { 
        await this.userService.getUserByEmail(email);

        const invite = await this.getInvite({email});
        if(invite && !invite.isExpired()) throw new AlreadyExistError("INVITE");

        const code = this.generateCode();
        const createdInvite = await this.inviteRepo.create({
            email,
            code,
            expiredAt: new Date(),
            projectId
        });

        if(!createdInvite) throw new NotCreatedError("INVITE");

        return true;
    }

    public async acceptInvite(projectId: number, code: string) {
        const invite = await this.getInvite({code});
        if(!invite || invite.isExpired()) throw new NotFoundError("INVITE");

        invite.setExpiredDate();

        const updated = await this.inviteRepo.update(
            {code}, 
            invite.toJSON()
        )
        if(!updated) throw new NotUpdatedError("INVITE");


        const email = invite.getEmail();
        const user = await this.userService.getUserByEmail(email);

        return  await this.memberService.create(projectId, user);
    }

    private generateCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }
}