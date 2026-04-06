import { BaseService } from "@shared/BaseService";

export class AuthService extends BaseService<'user'>{

    constructor() {
        super('user')
    }

    async login(email: string, password: string, jwt: any, cookie: any, status: any, remember?: boolean, ) {

        const user = (await this.getFirstByFields({email})).data
        if(!user) return  status(401, {code: 'INCORECT_DATA', description: "Invalid 'login' or 'password'"});
        
        const passwordValid = await Bun.password.verify(password, user.password)
        if(!passwordValid) return status(401, {code: 'INCORECT_DATA', description: "Invalid 'login' or 'password'"});

        const token = await jwt.sign({
            id: user.id
        })

        cookie['auth-token'].set({
            value: token,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
            path: '/'
        })

        return {data: user}
    }
}
