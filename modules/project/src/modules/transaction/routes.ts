import { Elysia, t } from 'elysia'
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { container } from '../../../../containers';

const {transactionService, transferService } = container

export const TransactionController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/transaction'
})
.derive(deriveUser)

.get('/', async({params: {pid, cid}, query, user}) => {
    const transactions = await transactionService.getByFilter(pid, cid, query, user)
    return {data: transactions}
}, schema.getByCashbox)

.get('/tags', async({params: {pid, cid}, user}) => {
    const transactionTags = await transactionService.getGroupedByTags(pid, cid, user);
    return {data: transactionTags}
},schema.getTags)

.post('/transfer', async({params: {pid, cid}, body, user}) => {
    const transaction = await transferService.transferMoneyBetweenCashbox(pid, cid, body, user);
    return {data: transaction}
}, schema.transfer)

.post('/external', async({params: {pid, cid}, body, user}) => {
    const transaction = await transferService.transferWithExternal(pid, cid, body, user)
    return {data: transaction}
}, schema.external)

.post('/:tid/cancel', async({params: {pid, cid, tid}, user}) => {
    const transaction = await transferService.cancelTransaction(tid, user, cid, pid)
    return {data: transaction}
}, schema.cancel)