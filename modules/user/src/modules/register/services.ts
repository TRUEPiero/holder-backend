import { MailService } from "../../lib/mail";
import { RegisterRepository } from "./repository";
import { UserService } from "../user/services";
import { AlreadyExistError, NotFoundError, NotUpdatedError } from "@common/errors";
import { getExpiredDate } from "../../../../../src/helpers/expiredDate";
import { randomUUID } from 'crypto';
import { GetFilter, RegisterData } from "./types";
import { AlreadyCheckedError } from "./errors";

export class RegisterService {
    constructor(
        private repo: RegisterRepository,
        private userService: UserService,
        private mailService: MailService
    ) {}

    public async getVerify(filter: GetFilter) {
        const verify = await this.repo.getByFilter(filter);
        return verify;
    }

    public async registerNewUser(data: RegisterData) {
        const {verify_code, ...createData} = data;

        const verify = await this.getVerify({
            email: createData.email,
            verifyToken: verify_code,
        });

        if(!verify?.checked()) throw new NotFoundError('VERIFY');

        const user = await this.userService.create(createData);

        await this.repo.delete(verify.getId());

        return user;
    }

    public async sendVerify(email: string) {
        await this.userService.exist(email);

        const verify = await this.getVerify({email});
        if(verify && verify.isActive()) throw new AlreadyExistError('VERIFY');
        if(verify && verify.checked()) throw new AlreadyCheckedError();

        const code = this.generateCode();

        await this.repo.create(
            {
                email,
                code,
                expiredAt: getExpiredDate(),
            }
        );

        const params = {
            intro: 'content'
        };

        const user = {
            login: email,
            name: 'Guest'
        }

        // await this.mailService.send(params, `Header`, user)
        
        return true
    }

    public async checkVerify(email: string, code: string) {
        const verify = await this.getVerify({email, code});
        if (!verify || !verify.isActive()) throw new NotFoundError("VERIFY");

        verify.setChecked()

        const {isChecked, expiredAt} = verify.response()
        const token = randomUUID();

        const updated = await this.repo.update(
            {code}, 
            {
                isChecked,
                expiredAt,
                verifyToken: token
            }
        )
        if(!updated) throw new NotUpdatedError("VERIFY");

        return updated;
    }

    private generateCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }
}
