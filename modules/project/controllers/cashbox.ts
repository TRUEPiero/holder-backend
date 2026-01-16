import {Elysia, t} from 'elysia';
import { schema } from '../schemas/cashbox';
import { CashboxService } from '../services/cashbox';

const service = new CashboxService();

export const CashboxController = new Elysia({
    prefix: '/project/:pid/cashbox'
})

.get('/', async ({params: {pid}}) => {
    return (await service.getProjectCashboxes(pid)).data;
},schema.getAll)

.post('/', async({params: {pid}, body}) => {
    return (await service.createCashbox(pid, body)).data
}, schema.create)

.patch('/:cid', async({params: {pid, cid}, body}) => {
    return await service.updateItem(cid, body);
}, {
    params: t.Object({
        pid: t.Number(),
        cid: t.Number()
    })
})

.delete('/:cid', async({params: {pid, cid}}) => {
    return await service.deleteItem(cid);
}, {
    params: t.Object({
        pid: t.Number(),
        cid: t.Number()
    })
})
