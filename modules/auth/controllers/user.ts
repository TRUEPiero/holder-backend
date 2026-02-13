import {Elysia, t} from 'elysia';
import { schema } from '../schemas/user';
import { deriveUser } from '@plugins/deriveUser';
import { UserService } from '../services/user';

const service = new UserService();

export const UserController = new Elysia({
    prefix: '/user'
})
.derive(deriveUser)
.get('/', async ({user}) => {
    return {data: user}
},schema.getUser)

.patch('/:uid', async({user, body, status}) => { 
    return await service.updateUser(user.id, body) || status(500, {error: 'Error while updating user'});
}, schema.updateUser)
