import { BaseService } from "@shared/BaseService";
import { ProjectService } from "../../project/services/project";

const projectService = new ProjectService;

export class AuthService extends BaseService<'user'>{

    constructor() {
        super('user')
    }

    async login(login: string, password: string, remember: boolean, jwt: any, cookie: any) {

        const user = (await this.getFirstByFields({login})).data

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

    async register(body: any, jwt: any, cookie: any) {

        const user = await this.createItem({
            ...body
        })

        if(!user.data) return null
        
        const projectData = {
            title: 'Новый проект',
            default: true,
            parameters: {},
            ownerId: user.data.id
        }

        const project = await projectService.createItem(projectData)

        const token = await jwt.sign({
            id: user.data.id
        })

        cookie['auth-token'].set({
            value: token,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: undefined,
            path: '/'
        })

        return {data: user.data || null}
    }
}
