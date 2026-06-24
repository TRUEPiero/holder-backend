import {Elysia } from 'elysia';
import { container } from '../../../../containers';
import { deriveUser } from '@plugins/deriveUser';
import { schema } from './schemas';

const {inviteService, memberService} = container;

export const MembershipController = new Elysia({
    prefix: 'project/:pid/membership'
})

.derive(deriveUser)

.get('/', async ({params: {pid}, user}) => {
    const members = await memberService.getByProject(pid, user);
    return {data: members}
}, schema.getByProject)

.post('/invite/send', async ({params: {pid}, body: {email}, user}) => {
    return await inviteService.sendInviteToUser(pid, email, user)
}, schema.invite) 

.post('/invite/accept', async ({params: {pid}, body: {code}, user}) => {
    const member =  await inviteService.acceptInvite(pid, code, user);
    return {data: member.response()}
}, schema.accept)

.patch('/:mid/role', async({params: {pid, mid}, body: {roleId}, user}) => {
    const member = await memberService.update(mid, user, {roleId}, pid); 
    return {data: member.response()}
}, schema.updateRole)

.delete('/:mid', async({params: {pid, mid}, user}) => {
    const member = await memberService.delete(mid, user, pid);
    return {data: member.response()};
}, schema.delete)