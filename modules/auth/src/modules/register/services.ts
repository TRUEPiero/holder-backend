import { MailService } from "../../../lib/mail";
import { RegisterRepository } from "./repository";
import { UserService } from "../user/services";
import { AlreadyExistError, NotFoundError, NotUpdatedError } from "@common/errors";

export class RegisterService {
    constructor(
        private repo: RegisterRepository,
        private userService: UserService,
        private mailService: MailService
    ) {}

    public async getVerify(filter: any) {
        const verify = await this.repo.getByFilter(filter);
        return verify;
    }

    public async registerNewUser(data: any) {
        return await this.userService.create(data);
    }

    public async sendVerify(email: string) {

        const verify = await this.getVerify({email});
        if(verify && verify.isActive()) throw new AlreadyExistError('VERIFY');

        const code = this.generateCode();

        await this.repo.create({
                email,
                code,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
            }
        );

        await this.mailService.send(`Content`, `Header`, {})
        
        return true
    }

    public async chechVerify(code: string) {

        const verify = await this.getVerify({code});
        if (!verify || !verify.isActive()) throw new NotFoundError("VERIFY") ;

        verify.setExpiredDate()
        const updated = await this.repo.update(
            {code}, 
            verify.toJSON()
        )
        if(!updated) throw new NotUpdatedError("VERIFY");

        return Boolean(updated)
    }

    private generateCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }
}
