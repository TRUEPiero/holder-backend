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
},schema.getUser)

.patch('/', async({user, body, status}) => { 
    try {
        const entity = await userService.updateUser(user, body);
        return {data: entity}
    } catch(e: any) {
        if(e.message === 'USER_NOT_FOUND') return status(404, {code: "USER_NOT_FOUND", description: 'USER by ID not founded'}); 
        return status(500, {code: "USER_NOT_FOUND", description: JSON.stringify(e)}); 
    }
}, schema.updateUser)
