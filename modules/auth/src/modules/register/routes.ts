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
    const user = await registerService.registerNewUser(body)

    const tokenService = new AuthTokenService(jwt);
    const token = await tokenService.generate(user);

    const cookieService = new AuthCookieService(cookie);
    await cookieService.set(token)

    return {data: user}
}, schema.register)

.post('/send', async({body: {email}, status}) => {
    return await registerService.sendVerify(email) || status(500, {code: '', description: "Error while send verify code"});
}, schema.sendVerify)

.post('/check', async({body: {verify_code}, status}) => {
    return await registerService.chechVerify(verify_code) || status(500, {code: '', description: "Verify code exists and not expired"});
}, schema.checkVerify)


