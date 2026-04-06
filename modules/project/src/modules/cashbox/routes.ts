import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { CashboxService } from './services';

const service = new CashboxService();

export const CashboxController = new Elysia({
    prefix: '/project/:pid/cashbox'
})

.get('/', async ({params: {pid}}) => {
    return await service.getProjectCashboxes(pid);
},schema.getAll)

.post('/', async({params: {pid}, body, status}) => {
    try {
        return await service.createCashbox(pid, body);
    } catch (error: any) {
        if(error.message === 'PROJECT_NOT_FOUND') return status(404, {code: 'PROJECT_NOT_FOUND', description: ''});
        return status(500, {code: 'CASHBOX_NOT_CREATED', description: ''});
    }
}, schema.create)

.patch('/:cid', async({params: {pid, cid}, body, status}) => {
    try {
        return await service.updateCashbox(cid, body);
    } catch (error: any) {
        if(error.message === 'CASHBOX_UNDEFINED') return status(404, {code: 'CASHBOX_UNDEFINED', description: ''});
        return status(500, {code: 'CASHBOX_NOT_UPDATED', description: ""});
    }
}, schema.update)

.delete('/:cid', async({params: {pid, cid}, status}) => {
    try {
        return await service.deleteCashbox(cid);
    } catch (error: any) {
        if(error.message === 'CASHBOX_UNDEFINED') return status(404, {code: 'CASHBOX_UNDEFINED', description: ''});
        return status(500, {code: 'CASHBOX_NOT_DELETED', description: ""});
    }
}, schema.delete)
