import { MailService } from "../../../lib/mail";
import { RegisterRepository } from "./repository";
import { UserRepository } from "../user/repository";

export class RegisterService {
    constructor(
        private repo: RegisterRepository,
        private userRepo: UserRepository,
        private mailService: MailService
    ) {}

    public async getVerify(filter: any) {
        const verify = await this.repo.getByFilter(filter);
        return verify;
    }

    public async registerNewUser(data: any) {
        const user = await this.userRepo.create(data)
        if(!user) throw new Error("USER_NOT_CREATED");

        return user;
    }

    public async sendVerify(email: string) {

        const verify = await this.getVerify({email});
        if(verify && verify.isActive()) throw new Error('VERIFY_ALREADY_EXIST');

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
        if (!verify || !verify.isActive()) throw new Error("VERIVY_NOT_FOUND") ;

        verify.setExpiredDate()
        const updated = await this.repo.update(
            {code}, 
            verify.toJSON()
        )
        if(!updated) throw new Error("UPDATE_ERROR");

        return Boolean(updated)
    }

    private generateCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }
}
