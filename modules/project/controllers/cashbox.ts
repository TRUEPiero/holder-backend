import {Elysia, t} from 'elysia';
import { schema } from '../schemas/cashbox';
import { CashboxService } from '../services/cashbox';

const service = new CashboxService();

export const CashboxApp = new Elysia({
    prefix: '/project/:pid/cashbox'
})

.get('/', async ({params: {pid}}) => {
    return await service.getProjectCashboxes(pid);
},schema.getAll)

.post('/', async({params: {pid}, body}) => {
    return await service.createCashbox(pid, body)
}, schema.create)
.patch('/:cid', async({params: {cid}, body}) => {
    return await service.updateItem(cid, body);
}, {
    params: t.Object({
        cid: t.Number()
    })
})
.delete('/:cid', async({params: {cid}}) => {
    return await service.deleteItem(cid);
}, {
    params: t.Object({
        cid: t.Number()
    })
})
