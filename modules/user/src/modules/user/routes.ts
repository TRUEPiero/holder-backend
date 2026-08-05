import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { container } from '../../../../containers';

const {userService} = container;

export const UserController = new Elysia({
    prefix: '/user'
})
.derive(deriveUser)

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
