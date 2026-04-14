import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { container } from '../../../../containers';
import { deriveUser } from '@plugins/deriveUser';

const {cashboxService} = container

export const CashboxController = new Elysia({
    prefix: '/project/:pid/cashbox'
})
.derive(deriveUser)

.get('/', async ({params: {pid}}) => {
    const cashboxes = await cashboxService.getByProject(pid);
    return {data: cashboxes}
},schema.getAll)

.get('/:cid', async({params: {pid, cid}}) => {
    const cashbox = await cashboxService.getDetail(cid);
    return {data: cashbox}
}, schema.detail)

.post('/', async({params: {pid}, body, user, status}) => {
    try {
        const cashbox = await cashboxService.create(pid, body, user);
        return {data: cashbox}
    } catch (error: any) {
        if(error.message === 'PROJECT_NOT_FOUND') return status(404, {code: 'PROJECT_NOT_FOUND', description: ''});
        return status(500, {code: 'CASHBOX_NOT_CREATED', description: ''});
    }
}, schema.create)

.patch('/:cid', async({params: {pid, cid}, body, user, status}) => {
    try {
        const cashbox = await cashboxService.update(pid, cid, body, user);
        return {data: cashbox}
    } catch (error: any) {
        if(error.message === 'CASHBOX_NOT_FOUND') return status(404, {code: 'CASHBOX_NOT_FOUND', description: ''});
        return status(500, {code: 'CASHBOX_NOT_UPDATED', description: JSON.stringify(error)});
    }
}, schema.update)

.delete('/:cid', async({params: {pid, cid}, user, status}) => {
    try {
        const cashbox = await cashboxService.delete(pid, cid, user);
        return {data: cashbox}
    } catch (error: any) {
        if(error.message === 'CASHBOX_NOT_FOUND') return status(404, {code: 'CASHBOX_NOT_FOUND', description: ''});
        return status(500, {code: 'CASHBOX_NOT_DELETED', description: ""});
    }
}, schema.delete)
