import { Elysia } from 'elysia';
import { schema } from './schemas';
import { AuthTokenService } from '../../common/services/token';
import { AuthCookieService } from '../../common/services/cookie';
import { container } from '../../../../containers';
import { jwtPlugin } from '@plugins/jwt';
import { SessionService } from '../../common/services/session';

const {registerService, casheService} = container;

export const RegisterController = new Elysia({
    prefix: '/register'
})
.use(jwtPlugin)

.post('/', async({body, jwt, cookie}) => {
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

    return {data: user}
}, schema.register)

.post('/send', async({body: {email}}) => {
    return await registerService.sendVerify(email);
}, schema.sendVerify)

.post('/check', async({body: {verify_code}}) => {
    return await registerService.checkVerify(verify_code)
}, schema.checkVerify)


