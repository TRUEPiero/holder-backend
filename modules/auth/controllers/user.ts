import {Elysia, t} from 'elysia';
import { schema } from '../schemas/user';
import { ResponseUser } from "../types/user"

export const UserController = new Elysia({
    prefix: '/user'
})
.get('/',
    async ({user, status}) => {
        return user || status(401, {error: 'unauthorized'})
    },
    schema.getUser
)
