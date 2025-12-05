import { Elysia, t } from 'elysia'
import { TransactionService } from '../services/transactions'

const service = new TransactionService('transaction');

export const TransactionController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/transaction'
})
.get('/', async({params: {pid, cid}}) => {
    return await service.getByFields({
        AND: [
            {cashboxId: cid},
            {cashbox: {
                projectId: pid
            }}
        ]
    })
})
.post('/', async({params: {pid, cid}, body}) => {
    return await service.createItem({cashboxId: cid, ...body});
}, {
    body: t.Object({})
})
.patch('/transfer', async({params: {pid, cid}, body}) => {
    return await service.moneyTransfer(pid, cid, body);
}, {
    params: t.Object({
        pid: t.Number(),
        cid: t.Number()
    }),
    body: t.Object({
        from: t.Number(),
        to: t.Number(),
        amount: t.Number()
    })
})