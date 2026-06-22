import { Elysia } from 'elysia'
import { schema } from './schemas';
import { AuthTokenService } from '../../common/services/token';
import { AuthCookieService } from '../../common/services/cookie';
import { container } from '../../../../containers';
import { jwtPlugin } from '@plugins/jwt';
import { SessionService } from '../../common/services/session';
import { UnautorizedError } from '@common/errors';

const { authService, userService, casheService } = container;

export const AuthController = new Elysia({
    prefix: '/auth'
})
.use(jwtPlugin)

.post('/login', async ({ body: { email, password }, jwt, cookie, set }) => {
    set.headers['content-type'] = 'application/json';
    
    const user = await authService.login(email, password);

    const tokenService = new AuthTokenService(jwt);
    const sessionService = new SessionService(
        casheService,
        tokenService
    )

    const { access, refresh } = await sessionService.create(user);

    const cookieService = new AuthCookieService(cookie);
    cookieService.setAccess(access)
    cookieService.setRefresh(refresh)

    return { data: user.response() }
}, schema.login)

.post('/refresh', async ({ jwt, cookie, set }) => {
    set.headers['content-type'] = 'application/json';

    const refreshToken: any = cookie['refresh_token']?.value;
    if (!refreshToken) throw new UnautorizedError();

    let payload = null;
    try {
        payload = await jwt.verify(refreshToken);
    } catch (error) {
        console.error(error);
        throw new UnautorizedError();
    }

    if (!payload || !payload.sub || !payload.jti) throw new UnautorizedError();

    const user = await userService.getUser(Number(payload.sub));
    const tokenService = new AuthTokenService(jwt);
    const sessionService = new SessionService(casheService, tokenService);

    const { access, refresh } = await sessionService.refresh(payload.jti, user);

    const cookieService = new AuthCookieService(cookie);
    cookieService.setAccess(access);
    cookieService.setRefresh(refresh);

    return true;
}, schema.refresh)

.post('/logout', async ({ jwt, cookie, set }) => {
    set.headers['content-type'] = 'application/json';
    
    const refreshToken: any = cookie['refresh_token']?.value;

    if (refreshToken) {
        let payload = null;
        try {
            payload = await jwt.verify(refreshToken);
        } catch (error) {
            console.error(error);
            throw new UnautorizedError();
        }

        if (payload && payload?.jti) {
            const tokenService = new AuthTokenService(jwt);
            const sessionService = new SessionService(casheService, tokenService);
            await sessionService.revoke(payload.jti);
        }
    }

    new AuthCookieService(cookie).clear();
    return true;
}, schema.logout)

