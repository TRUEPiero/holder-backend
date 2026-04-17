import { Elysia, t } from 'elysia';
import jwt from '@elysiajs/jwt';
import { schema } from './schemas';
import { AuthTokenService } from '../../../common/services/token';
import { AuthCookieService } from '../../../common/services/cookie';
import { container } from '../../../../containers';

const {registerService} = container;

export const RegisterController = new Elysia({
    prefix: '/register'
})
.use(jwt({secret: process.env.JWT_SECRET!}))

.post('/', async({body, jwt, cookie, status}) => {
    try {
        const user = await registerService.registerNewUser(body)

        const tokenService = new AuthTokenService(jwt);
        const token = await tokenService.generate(user);

        const cookieService = new AuthCookieService(cookie);
        await cookieService.set(token)

        return {data: user}
    } catch(error: any) {
        if(error.message === "VERIFY_ALREADY_EXIST") return status(401, {code: "VERIFY_ALREADY_EXIST", description: ''})
        return status(500, {code: "USER_NOT_CREATED", description: ''})
    }
}, schema.register)

.post('/send', async({body: {email}, status}) => {
    try {
        return await registerService.sendVerify(email);
    } catch (error: any) {
        if(error.message === "VERIVY_NOT_FOUND") return status(404, {code: "VERIVY_NOT_FOUND", description: ''})
        return status(500, {code: "ERROR", description:""})
    }
}, schema.sendVerify)

.post('/check', async({body: {verify_code}, status}) => {
    try{
        return await registerService.chechVerify(verify_code)
    } catch (error) {
        return status(500, {code: "ERROR", description:""})
    }
}, schema.checkVerify)


