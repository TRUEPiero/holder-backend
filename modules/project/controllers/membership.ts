import {Elysia, t} from 'elysia';
import { MembershipService } from '../services/membership';

const service = new MembershipService();

export const MembershipController = new Elysia({
    prefix: 'project/:pid/membership'
})

.post('/invite', async ({params: {pid}, body: {userEmail}, status}) => {
    return await service.sendInviteMessage(pid, userEmail, status)
}, {    
    params: t.Object({
        pid: t.Number()
    }),
    body: t.Object({
        userEmail: t.String()
    })
}) 

.post('/verify', async ({}) => {
    return true;
})