import { Elysia, t } from 'elysia';
import jwt from '@elysiajs/jwt';
import { DirectoryService } from '@shared/DirectoryService';
import { schema } from './schemas';
import { RegisterService } from './services';
import { RegisterRepository } from './repository';
import { AuthTokenService } from '../../../common/services/token';
import { AuthCookieService } from '../../../common/services/cookie';

const base = new DirectoryService<'registerVerify'>('registerVerify', [])
const repo = new RegisterRepository(base);
const service = new RegisterService(repo);

export const RegisterController = new Elysia({
    prefix: '/register'
})
.use(jwt({secret: process.env.JWT_SECRET!}))

.post('/', async({body, jwt, cookie, status}) => {
    const user = await service.register(body)

    const tokenService = new AuthTokenService(jwt);
    const token = await tokenService.generate(user);

    const cookieService = new AuthCookieService(cookie);
    await cookieService.set(token)

    return {data: user}
}, schema.register)

.post('/send', async({body: {email}, status}) => {
    return await service.createVerify(email) || status(500, {code: '', description: "Error while send verify code"});
}, schema.sendVerify)

.post('/check', async({body: {verify_code}, status}) => {
    return await service.chechVerify(verify_code) || status(500, {code: '', description: "Verify code exists and not expired"});
}, schema.checkVerify)


