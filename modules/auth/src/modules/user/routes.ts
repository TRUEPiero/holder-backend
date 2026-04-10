import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { UserService } from './services';
import { DirectoryService } from '@shared/DirectoryService';
import { UserRepository } from './repository';

const base = new DirectoryService<'user'>('user', [])
const repo = new UserRepository(base);

const service = new UserService(repo);

export const UserController = new Elysia({
    prefix: '/user'
})
.derive(deriveUser)

.get('/me', async ({user}) => {
    return {data: user.toJSON()}
},schema.getUser)

.patch('/', async({user, body, status}) => { 
    try {
        const entity = await service.updateUser(user, body);
        return {data: entity}
    } catch(e) {
        if(e.message === 'USER_NOT_FOUND') return status(404, {code: "USER_NOT_FOUND", description: 'USER by ID not founded'}); 
        return status(500, {code: "USER_NOT_FOUND", description: JSON.stringify(e)}); 
    }
}, schema.updateUser)
