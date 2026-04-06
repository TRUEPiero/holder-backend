import { BaseService } from "@shared/BaseService";
import { MailService } from "../../../lib/mail";

export class RegisterService extends BaseService<'registerVerify'> {
    constructor() {
        super('registerVerify')
    }

    async register(body: any, jwt: any, cookie: any) {

        const user = await this.createItem({
            ...body
        })

        if(!user.data) return null

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

        const exist = await this.getFirstByFields({
                email,
                expiredAt: {
                    gt: new Date(),
                },
            }
        );

        if(exist.data) return null;
    
        const code = Math.floor(10000 + Math.random() * 90000).toString();

        await this.createItem({
                email,
                code,
                expiredAt: new Date(Date.now() + 10 * 60 * 1000),
            }
        );

        await new MailService().send(`Content`, `Header`, {})
        
        return true
    }

    async chechVerify(code: string) {

        const exist = await this.getFirstByFields({
            code,
            expiredAt: {
                gt: new Date(),
            },
        });

        if (!exist.data) return null;

        await this.updateByFields(
            {code}, 
            {expiredAt: new Date()}
        )

        return {email: exist.data.email}
    }
}
