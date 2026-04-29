import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { container } from '../../../../containers';
import { deriveUser } from '@plugins/deriveUser';

const {cashboxService} = container

export const CashboxController = new Elysia({
    prefix: '/project/:pid/cashbox'
})
.derive(deriveUser)

.get('/', async ({params: {pid}, user}) => {
    const cashboxes = await cashboxService.getByProject(pid, user);
    return {data: cashboxes}
},schema.getAll)

.get('/:cid', async({params: {pid, cid}, user}) => {
    const cashbox = await cashboxService.getById(cid, user, pid);
    return {data: cashbox}
}, schema.detail)

.post('/', async({params: {pid}, body, user}) => {
    const cashbox = await cashboxService.create(pid, body, user);
    return {data: cashbox}
}, schema.create)

.patch('/:cid', async({params: {pid, cid}, body, user}) => {
    const cashbox = await cashboxService.update(pid, cid, body, user);
    return {data: cashbox}
}, schema.update)

.delete('/:cid', async({params: {pid, cid}, user}) => {
    const cashbox = await cashboxService.delete(pid, cid, user);
    return {data: cashbox}
}, schema.delete)
