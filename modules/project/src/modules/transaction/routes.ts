import { Elysia, t } from 'elysia'
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { container } from '../../../../containers';

const {transactionService, transferService} = container

export const TransactionController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/transaction'
})
.derive(deriveUser)

.get('/', async({params: {pid, cid}}) => {
    const transactions = await transactionService.getByCashbox(pid, cid)
    return {data: transactions}
}, schema.get)

.post('/transfer', async({params: {pid, cid}, body, user}) => {
    return await transferService.transferMoneyBetweenCashbox(pid, cid, body, user);
}, schema.transfer)

.post('/external', async({params: {pid, cid}, body, user}) => {
    return await transferService.transferWithExternal(pid, cid, body, user)
}, schema.external)