import { Elysia, t } from 'elysia'
import { AuthService } from '../services/auth'
import { schema } from '../schemas/auth';
import jwt from "@elysiajs/jwt";

const service = new AuthService();

export const AuthController = new Elysia({
    prefix: '/auth'
})
.use(jwt({secret: process.env.JWT_SECRET!}))

.post('/login', async ({body: {email, password, remember}, jwt, cookie, status}) => {
    return await service.login(email, password, jwt, cookie, remember) || status(401, {error: "Invalid 'login' or 'password'"});
}, schema.login)
