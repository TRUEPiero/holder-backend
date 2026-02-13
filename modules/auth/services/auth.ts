import { BaseService } from "@shared/BaseService";
import { ProjectService } from "../../project/services/project";

const projectService = new ProjectService;

export class AuthService extends BaseService<'user'>{

    constructor() {
        super('user')
    }

    async login(email: string, password: string, jwt: any, cookie: any, remember?: boolean) {

        const user = (await this.getFirstByFields({email})).data

        if(!user) return null
        
        const passwordValid = await Bun.password.verify(password, user.password)
        if(!passwordValid) return null

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

        return {data: user || null}
    }
}
