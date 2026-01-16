import { Elysia, t } from 'elysia'
import { TransactionService } from '../services/transactions'

const service = new TransactionService();

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
.post('/transfer', async({params: {pid, cid}, body, user}) => {
    return await service.moneyTransfer(pid, cid, body, user);
}, {
    params: t.Object({
        pid: t.Number(),
        cid: t.Number()
    }),
    body: t.Object({
        to: t.Number(),
        amount: t.Number()
    })
})