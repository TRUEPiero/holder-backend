import {Elysia, t} from 'elysia';
import { MembershipService } from './services';
import { ProjectInviteService } from './InviteService';

const service = new MembershipService();
const inviteService = new ProjectInviteService()

export const MembershipController = new Elysia({
    prefix: 'project/:pid/membership'
})

.post('/invite', async ({params: {pid}, body: {userEmail}, status}) => {
    return await inviteService.sendInvite(pid, userEmail)
}, {    
    params: t.Object({
        pid: t.Number()
    }),
    body: t.Object({
        userEmail: t.String()
    })
}) 

.post('/check', async ({}) => {
    return true;
})