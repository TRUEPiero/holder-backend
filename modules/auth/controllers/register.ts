import { Elysia, t } from 'elysia';
import { RegisterService } from '../services/register';
import { schema } from '../schemas/register';
import jwt from '@elysiajs/jwt';

const service = new RegisterService();
export const RegisterController = new Elysia({
    prefix: '/register'
})
.use(jwt({secret: process.env.JWT_SECRET!}))

.post('/', async({body, jwt, cookie, status}) => {
    return await service.register(body, jwt, cookie) || status(500, {error: "Error while register"});
}, schema.register)

.post('/send', async({body: {email}, status}) => {
    return await service.sendVerify(email) || status(500, {error: "Error while send verify code"});
}, schema.sendVerify)

.post('/check', async({body: {verify_code}, status}) => {
    return await service.chechVerify(verify_code) || status(500, {error: "Verify code exists and not expired"});
}, schema.checkVerify)


