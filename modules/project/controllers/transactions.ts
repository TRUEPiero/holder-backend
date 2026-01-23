import { Elysia, t } from 'elysia'
import { TransactionService } from '../services/transactions'
import { schema } from '../schemas/transaction';

const service = new TransactionService();

export const TransactionController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/transaction'
})
.get('/', async({params: {pid, cid}}) => {
    return await service.getTransactions(pid, cid)
}, schema.get)

.post('/transfer', async({params: {pid, cid}, body, user}) => {
    return await service.moneyTransfer(pid, cid, body, user);
}, schema.transfer)