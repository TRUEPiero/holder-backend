import { Elysia, t } from 'elysia'
import { AuthService } from './services'
import { schema } from './schemas';
import jwt from "@elysiajs/jwt";
import { DirectoryService } from '@shared/DirectoryService';
import { UserRepository } from '../user/repository';
import { AuthTokenService } from '../../../common/services/token';
import { AuthCookieService } from '../../../common/services/cookie';

const base = new DirectoryService<'user'>('user', [])
const repo = new UserRepository(base);
const service = new AuthService(repo);

export const AuthController = new Elysia({
    prefix: '/auth'
})
.use(jwt({secret: process.env.JWT_SECRET!}))

.post('/login', async ({body: {email, password, remember}, jwt, cookie, status}) => {
    const user = await service.login(email, password);

    const tokenService = new AuthTokenService(jwt);
    const token = await tokenService.generate(user);

    const cookieService = new AuthCookieService(cookie);
    await cookieService.set(token, remember) 

    return {data: user}
}, schema.login)
