import { BaseService } from "@shared/BaseService";
import { ProjectService } from "../../project/services/project";
import db from "@common/prisma";
import { MailService } from "../lib/mail";

const projectService = new ProjectService;

export class RegisterService extends BaseService<'user'> {
    constructor() {
        super('user')
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

        await projectService.createItem(projectData)

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

    async sendVerify(email: string) {

        const user = (await this.getFirstByFields({ email })).data
        if (user) return null

        const exist = await db.registerVerify.findFirst({
            where: {
                email,
                expiredAt: {
                    gt: new Date(),
                },
            },
        });
        if(exist) return null;
    
        const code = Math.floor(10000 + Math.random() * 90000).toString();

        await db.registerVerify.create({
            data: {
                email,
                code,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        await new MailService().send(`Content`, `Header`, {})
        
        return true
    }

    async chechVerify(code: string) {

        const exist = await db.registerVerify.findFirst({
        where: {
            code,
            expiredAt: {
                gt: new Date(),
            },
        },
        });
        if (!exist) return null;

        await db.registerVerify.updateMany({
            where: {
                code
            },
            data: {
                expiredAt: new Date()
            }
        })

        return {email: exist.email}
    }
}
