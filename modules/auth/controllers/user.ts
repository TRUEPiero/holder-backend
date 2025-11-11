import {Elysia, t} from 'elysia';

export const UserController = new Elysia({
    prefix: '/user'
})
.get('/',
    async ({user, status}) => {
        return user || status(401, {error: 'unauthorized'})
    },
)
