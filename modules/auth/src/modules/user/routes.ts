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
    return {data: user.toJSON()}
}, schema.getUser)

.patch('/', async({user, body}) => { 
    const entity = await userService.update(user, body);
    return {data: entity}
}, schema.updateUser)
