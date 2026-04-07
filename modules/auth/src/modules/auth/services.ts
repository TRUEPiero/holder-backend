import { UserRepository } from "../user/repository";

export class AuthService{

    constructor(private repo: UserRepository) {}

    async login(email: string, password: string) {

        const user = await this.repo.findByEmail(email);
        if(!user) throw new Error('INVALID_DATA');
        
        const passwordValid = await Bun.password.verify(password, user.password)
        if(!passwordValid) throw new Error('INVALID_DATA');

        return user;
    }
}
