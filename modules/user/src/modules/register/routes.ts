import { Elysia } from 'elysia';
import { jwtPlugin } from '@plugins/jwt';
import { schema } from './schemas';
import { container } from '../../../../containers';
import { AuthTokenService } from '../../common/services/token';
import { AuthCookieService } from '../../common/services/cookie';
import { SessionService } from '../../common/services/session';

const {registerService, casheService} = container;

export const RegisterController = new Elysia({
    prefix: '/register'
})
.use(jwtPlugin)

.post('/', async({body, jwt, cookie, set}) => {
    set.headers['content-type'] = 'application/json';
    
    const user = await registerService.registerNewUser(body)

    const tokenService = new AuthTokenService(jwt);
    const sessionService = new SessionService(
        casheService,
        tokenService
    )

    const {access, refresh} = await sessionService.create(user);
    
    const cookieService = new AuthCookieService(cookie);
    cookieService.setAccess(access);
    cookieService.setRefresh(refresh);

    return {data: user.response()}
}, schema.register)

.post('/send', async({body: {email}}) => {
    return await registerService.sendVerify(email);
}, schema.sendVerify)

.post('/check', async({body: {email, verify_code}}) => {
    const verify = await registerService.checkVerify(email, verify_code)

    return {data: verify.response()}
}, schema.checkVerify)


