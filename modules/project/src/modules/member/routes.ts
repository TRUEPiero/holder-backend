import {Elysia, t} from 'elysia';
import { errorSchema } from '@schemas/error';
import { container } from '../../../../containers';
import { deriveUser } from '@plugins/deriveUser';

const {inviteService, memberService} = container;

export const MembershipController = new Elysia({
    prefix: 'project/:pid/membership'
})

.derive(deriveUser)

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
    return await inviteService.acceptInvite(pid, code);
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

.patch('/:mid/role', async({params: {pid, mid}, body: {role}, user}) => {
    return await memberService.update(pid, mid, {role}, user); 
}, {
    params: t.Object({
        pid: t.Number(),
        mid: t.Number(),
    }),
    body: t.Object({
        role: t.Any()
    })
})