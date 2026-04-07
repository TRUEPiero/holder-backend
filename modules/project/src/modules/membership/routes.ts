import {Elysia, t} from 'elysia';
import { ProjectInviteService } from './services/invite';
import { DirectoryService } from '@shared/DirectoryService';
import { InviteRepository } from './repository';

const base = new DirectoryService<'projectInvite'>('projectInvite', [])
const repo = new InviteRepository(base);

const inviteService = new ProjectInviteService(repo)

export const MembershipController = new Elysia({
    prefix: 'project/:pid/membership'
})

.post('/invite', async ({params: {pid}, body: {email}, status}) => {
    return await inviteService.sendInvite(pid, email)
}, {    
    params: t.Object({
        pid: t.Number()
    }),
    body: t.Object({
        email: t.String()
    })
}) 

.post('/accept', async ({params: {pid},body: {code}}) => {
    return await inviteService.checkInvite(code)
}, {
    body: t.Object({
        code: t.String()
    })
})