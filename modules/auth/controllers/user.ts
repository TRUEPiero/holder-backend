import {Elysia, t} from 'elysia';
import { schema } from '../schemas/user';
import { deriveUser } from '@plugins/deriveUser';
import { UserService } from '../services/user';

const service = new UserService();

export const UserController = new Elysia({
    prefix: '/user'
})
.derive(deriveUser)
.get('/',
    async ({user}) => user,
    schema.getUser
)
.patch('/:uid', async({params: {uid}, body, status}) => {
    
    return (await service.updateUser(uid, body)).data || status(400, {error: 'Error while updating user'});
}, schema.updateUser)
