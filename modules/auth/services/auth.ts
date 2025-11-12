import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export class AuthService {
    async login(login: string, password: string, remember: boolean, jwt: any, cookie: any) {

        const user = await db.user.findFirst({
            where: {
                login
            }
        })

        if(!user) return null
        const passwordValid = await Bun.password.verify(password, user.password);
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
        });

        return user;
    }

    async logout(cookie: any):Promise<boolean> {
        cookie['auth-token'].remove()

        return true;
    }
}
