import { UserRepository } from "../../../../../auth/src/modules/user/repository";
import { InviteRepository } from "../repositories/invite";
import { MembershipService } from "./membership";

export class ProjectInviteService {
    constructor(
        private inviteRepo: InviteRepository,
        private userRepo: UserRepository,
        private memberService: MembershipService
    ) {}

    public async getInvite(filter: any) {
        return await this.inviteRepo.getByFilter(filter);
    }

    public async sendInviteToUser(projectId: number, email: string) { 
        const user = await this.userRepo.findByEmail(email);
        if(!user) throw new Error("USER_UNDEFINED");

        const invite = await this.getInvite({email});


        if(invite && !invite.isExpired()) throw new Error("INVITE_ALREADY_EXIST");

        const code = this.generateCode();

        const createdInvite = await this.inviteRepo.create({
            email,
            code,
            expiredAt: new Date(),
            projectId
        });

        if(!createdInvite) throw new Error("INVITE_NOT_CREATED");

        return true;
    }

    public async acceptInvite(projectId: number, code: string) {
        const invite = await this.getInvite({code});
        if(!invite) throw new Error("INVITE_ERROR");
        if(invite.isExpired()) throw new Error("INVITE_ERROR");

        invite.setExpiredDate();

        const updated = await this.inviteRepo.update(
            {code}, 
            invite.toJSON()
        )
        if(!updated) throw new Error("UPDATE_ERROR");


        const email = invite.getEmail();

        const user = await this.userRepo.findByEmail(email);
        if(!user) throw new Error("USER_UNDEFINED");

        return  await this.memberService.create(projectId, user);
    }

    private generateCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }
}