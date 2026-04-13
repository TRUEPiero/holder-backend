import {Elysia, t} from 'elysia';
import { errorSchema } from '@schemas/error';
import { container } from '../../../../containers';

const {inviteService} = container;

export const MembershipController = new Elysia({
    prefix: 'project/:pid/membership'
})

.post('/invite/send', async ({params: {pid}, body: {email}, status}) => {
    return await inviteService.sendInviteToUser(pid, email)
}, {    
    params: t.Object({
        pid: t.Number()
    }),
    body: t.Object({
        email: t.String()
    })
}) 

.post('/invite/accept', async ({params: {pid},body: {code}}) => {
    const test = await inviteService.acceptInvite(pid, code);
    return test
}, {
    params: t.Object({
        pid: t.Number()
    }),
    body: t.Object({
        code: t.String()
    }),
    response: {
        200: t.Any(),
        ...errorSchema
    }
})