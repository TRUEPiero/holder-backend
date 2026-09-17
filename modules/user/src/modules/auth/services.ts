import { InvalidFieldError } from "@common/errors";
import { checkValidPass } from "../../lib/password";
import { UserService } from "../user/services";

export class AuthService{

    constructor(
        private userService: UserService
    ) {}

    async login(email: string, password: string) {

        const user = await this.userService.getUserByEmail(email);

        const isPasswordValid = await checkValidPass(password, user.getPassword());
        if(!isPasswordValid) throw new InvalidFieldError('PASSWORD');

        return user;
    }
}
