import { BaseService } from "@shared/BaseService";
import { UserService } from "../../../../auth/src/modules/user/services";
import { MembershipService } from "./services";

const userService = new UserService();
const membershipService = new MembershipService();

export class ProjectInviteService extends BaseService<'projectInvite'> {
    constructor() {
        super('projectInvite');
    }

    public async getInvite(email: string) {
        return await this.getByFields({
            email,
            expiredAt: {
                gt: new Date(),
            },
        })
    }

    public async createInvite(email: string) {
        const invite = await this.createItem({
                email,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
            }
        );

        if(!invite.data) throw new Error('ERROR'); 
    }

    public async acceptInvite(code: string) {
        await this.updateByFields(
            {code}, 
            {expiredAt: new Date()}
        )
    }

    public async sendInvite(projectId: number, userEmail: string) {
        const user = await userService.getUserByEmail(userEmail);
        if(!user) throw new Error("USER_UNDEFINED");

        const exist = await this.getInvite(userEmail);
        if(exist.data) return false;

        await this.createInvite(userEmail);

        // await new MailService().send(`Content`, `Header`, {})

        return true;
    }

    public async chechInvite(code: string, projectId: number, user: any) {
        const exist = await this.getFirstByFields({
            code,
            expiredAt: {
                gt: new Date(),
            },
        });
        if (!exist.data) return null;

        await this.acceptInvite(code);

        await membershipService.addMembership(projectId, user.id);
    }
}