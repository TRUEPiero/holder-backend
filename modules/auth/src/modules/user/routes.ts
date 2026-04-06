import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { UserService } from './services';

const service = new UserService();

export const UserController = new Elysia({
    prefix: '/user'
})
.derive(deriveUser)

.get('/me', async ({user}) => {
    return user
},schema.getUser)

.patch('/:uid', async({user, body, status}) => { 
    return await service.updateUser(user.id, body, status);
}, schema.updateUser)
