import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { container } from '../../../../containers';
import { jwtPlugin } from '@plugins/jwt';

const {userService, telegramLinkService} = container;

export const UserController = new Elysia({
    prefix: '/user'
})
.use(jwtPlugin)
.derive(deriveUser)

.post('/telegram/link', async ({user, set}) => {
    set.headers['cache-control'] = 'no-store';
    return { data: await telegramLinkService.issue(user) };
}, {
    response: {
        200: t.Object({ data: t.Object({ token: t.String(), expiresIn: t.Number() }) })
    }
})

.get('/me', async ({user}) => {
    return {data: user.response()}
}, schema.getUser)

.patch('/', async({user, body}) => { 
    const entity = await userService.update(user, body);
    return {data: entity.response()}
}, schema.updateUser)

.post('/password/reset/send', async() => {
    return await userService.sendResetPassword();
}, schema.resetPassword)

.post('/password/reset/check', async() => {
    return await userService.checkResetPassword();
}, schema.resetPassword)
