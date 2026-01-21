import { Elysia } from 'elysia'
import { AuthService } from '../services/auth'
import { schema } from '../schemas/auth';
import jwt from "@elysiajs/jwt";

const service = new AuthService();

export const AuthController = new Elysia({
    prefix: 'auth'
})
.use(jwt({secret: process.env.JWT_SECRET!}))

.post('/login', async ({body: {login, password, remember}, jwt, cookie, status}) => {
    return await service.login(login, password, remember, jwt, cookie) || status(401, {error: "Invalid 'login' or 'password'"});
}, schema.login)

.post('/register', async({body, jwt, cookie, status}) => {
    return await service.register(body, jwt, cookie) || status(401, {error: "Invalid 'login' or 'password'"});
}, schema.register)
