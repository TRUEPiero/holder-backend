import { DirectoryService } from "@shared/DirectoryService";
import { UserRepository } from "../../../../../auth/src/modules/user/repository";
import { InviteRepository } from "../repository";

const userBase = new DirectoryService<'user'>('user', [])
const userRepo = new UserRepository(userBase);

export class ProjectInviteService {
    constructor(private repo: InviteRepository) {}

    public async getInvite(filter: any) {
        const invite = await this.repo.getByFilter(filter);
        if(!invite) throw new Error("VERIFY_NOT_FOUND");
        return invite;
    }

    public async sendInvite(projectId: number, email: string) {
        const user = await userRepo.findByEmail(email);
        if(!user) throw new Error("USER_UNDEFINED");

        const invite = await this.getInvite({email});
        if(invite && !invite.isExpired) return false;

        const code = this.generateCode();

        await this.repo.create({
            email,
            code,
            expiredAt: new Date(),
            projectId
        });

        // await new MailService().send(`Content`, `Header`, {})

        return true;
    }

    public async checkInvite(code: string) {
        const invite = await this.getInvite({code});
        if(invite.isExpired()) return null;

        invite.setExpiredDate();

        const updated = await this.repo.update(
            {code}, 
            invite.toJSON()
        )
        if(!updated) throw new Error("UPDATE_ERROR");

        

        return Boolean(updated)
    }

    private generateCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }
}