import { MailService } from "../../../lib/mail";
import { RegisterRepository } from "./repository";
import { UserRepository } from "../user/repository";
import { DirectoryService } from "@shared/DirectoryService";

const base = new DirectoryService<'user'>('user', [])
const userRepo = new UserRepository(base);
const mailService = new MailService();

export class RegisterService {
    constructor(
        private repo: RegisterRepository
    ) {}

    public async getVerify(filter: any) {
        const verify = await this.repo.getByFilter(filter);
        return verify;
    }

    public async register(data: any) {
        const user = await userRepo.create(data)
        if(!user) throw new Error("USER_NOT_CREATED");

        return user;
    }

    public async createVerify(email: string) {

        const verify = await this.getVerify({email});
        if(verify && !verify.isExpired()) return null;

        const code = this.generateCode();

        await this.repo.create({
                email,
                code,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
            }
        );

        await mailService.send(`Content`, `Header`, {})
        
        return true
    }

    public async chechVerify(code: string) {

        const verify = await this.getVerify({code});
        if (verify.isExpired()) return null;

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
