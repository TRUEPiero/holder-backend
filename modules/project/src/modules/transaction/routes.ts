import { Elysia, t } from 'elysia'
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { container } from '../../../../containers';

const {transactionService, transferService} = container

export const TransactionController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/transaction'
})
.derive(deriveUser)

.get('/', async({params: {pid, cid}, status}) => {
    try {
        const transactions = await transactionService.getByCashbox(pid, cid)
        return {data: transactions}
    } catch (error) {
        return status(500, {code: "ERROR", description: ""})
    }
}, schema.get)

.post('/transfer', async({params: {pid, cid}, body, user, status}) => {
    try {
        return await transferService.transferMoneyBetweenCashbox(pid, cid, body, user);
    } catch (error) {
        return status(500, {code: "TRANSFER_NOT_COMPLETED", description: JSON.stringify(error)})
    }
}, schema.transfer)

.post('/external', async({params: {pid, cid}, body, user, status}) => {
    try {
        return await transferService.transferWithExternal(pid, cid, body, user)
    } catch (error) {
        return status(500, {code: "TRANSFER_NOT_COMPLETED", description: JSON.stringify(error)})
    }
}, schema.external)