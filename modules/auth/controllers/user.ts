import {Elysia, t} from 'elysia';
import { schema } from '../schemas/user';
import { deriveUser } from '@plugins/deriveUser';

export const UserController = new Elysia({
    prefix: '/user'
})
.derive(deriveUser)
.get('/',
    async ({user}) => {
        return user;
    },
    schema.getUser
)
