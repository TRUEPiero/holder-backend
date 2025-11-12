import { Elysia } from 'elysia'
import { AuthService } from '../services/auth'
import { schema } from '../schemas/auth';

const service = new AuthService();

export const AuthController = new Elysia({
    prefix: 'auth'
})

.post('/login',
    async ({body: {login, password, remember}, jwt, cookie, status}) => {
        const user = await service.login(login, password, remember, jwt, cookie);
        return user || status(401, {error: "Invalid 'login' or 'password'"});
    },
    schema.login
)
.post('/logout',
    async({cookie}) => {
        const response = await service.logout(cookie);
        return response;
    }
)
