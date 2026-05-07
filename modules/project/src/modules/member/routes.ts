import {Elysia } from 'elysia';
import { container } from '../../../../containers';
import { deriveUser } from '@plugins/deriveUser';
import { schema } from './schemas';

const {inviteService, memberService} = container;

export const MembershipController = new Elysia({
    prefix: 'project/:pid/membership'
})

.derive(deriveUser)

.post('/invite/send', async ({params: {pid}, body: {email}, user}) => {
    return await inviteService.sendInviteToUser(pid, email, user)
    
}, schema.invite) 

.post('/invite/accept', async ({params: {pid}, body: {code}, user}) => {
    const member =  await inviteService.acceptInvite(pid, code, user);
    return {data: member}
}, schema.accept)

.patch('/:mid/role', async({params: {pid, mid}, body: {role}, user}) => {
    const member = await memberService.update(pid, mid, {role}, user); 
    return {data: member}
}, schema.updateRole)

.delete('/:mid', async({params: {pid, mid}, user}) => {
    const member = await memberService.delete(pid, mid, user);
    return {data: member};
}, schema.delete)