import { Elysia, t } from 'elysia'
import jwt from "@elysiajs/jwt";
import { schema } from './schemas';
import { AuthTokenService } from '../../../common/services/token';
import { AuthCookieService } from '../../../common/services/cookie';
import { container } from '../../../../containers';

const {authService} = container;

export const AuthController = new Elysia({
    prefix: '/auth'
})
.use(jwt({secret: process.env.JWT_SECRET!}))

.post('/login', async ({body: {email, password, remember}, jwt, cookie, status}) => {
    const user = await authService.login(email, password);

    const tokenService = new AuthTokenService(jwt);
    const token = await tokenService.generate(user);

    const cookieService = new AuthCookieService(cookie);
    await cookieService.set(token, remember) 

    return {data: user}
}, schema.login)
