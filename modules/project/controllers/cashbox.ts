import {Elysia, t} from 'elysia';
import { CashboxService } from '../services/cashbox';

const service = new CashboxService();

export const CashboxApp = new Elysia({
    prefix: '/project/:pid/cashbox'
})
.get('/', async ({params: {pid}}) => {
    return await service.getProjectCashboxes(pid);
},{
    params: t.Object({
        pid: t.Number(),
    })
})
.post('/', async({params: {pid}, body}) => {
    return await service.createCashbox(pid, body)
}, {
    params: t.Object({
        pid: t.Number(),
    })
})
