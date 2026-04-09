import {Elysia, t} from 'elysia';
import { ProjectInviteService } from './services/invite';
import { DirectoryService } from '@shared/DirectoryService';
import { InviteRepository } from './repository';
import { UserRepository } from '../../../../auth/src/modules/user/repository';
import { MembershipRepository } from './repositories/membership';
import { MembershipService } from './services/membership';
import { errorSchema } from '@schemas/error';

const inviteBase = new DirectoryService<'projectInvite'>('projectInvite', [])
const inviteRepo = new InviteRepository(inviteBase);

const userBase = new DirectoryService<'user'>('user', [])
const userRepo = new UserRepository(userBase);

const memberBase = new DirectoryService<'projectMembership'>('projectMembership', ['user', 'project'])
const memberRepo = new MembershipRepository(memberBase);
const memberService = new MembershipService(memberRepo);

const inviteService = new ProjectInviteService(inviteRepo, userRepo, memberService)

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