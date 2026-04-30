import { InvalidFieldError } from "@common/errors";
import { checkValidPass } from "../../lib/passVerify";
import { UserService } from "../user/services";

export class AuthService{

    constructor(
        private userService: UserService
    ) {}

    async login(email: string, password: string) {

        const user = await this.userService.getUserByEmail(email);

        const passwordValid = await checkValidPass(password, user);
        if(!passwordValid) throw new InvalidFieldError('PASSWORD');

        return user;
    }
}
