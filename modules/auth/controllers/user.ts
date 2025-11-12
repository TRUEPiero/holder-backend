import {Elysia, t} from 'elysia';
import { schema } from '../schemas/user';
import { ResponseUser } from "../types/user"
import { deriveUser } from '../../../shared/deriveUser';

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
