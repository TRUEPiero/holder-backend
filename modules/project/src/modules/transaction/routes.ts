import { Elysia, t } from 'elysia'
import { TransactionService } from './services'
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { TransferService } from './TransferService';

const service = new TransactionService();
const transfer = new TransferService();

export const TransactionController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/transaction'
})
.derive(deriveUser)

.get('/', async({params: {pid, cid}}) => {
    return await service.getTransactions(pid, cid)
}, schema.get)

.post('/transfer', async({params: {pid, cid}, body, user}) => {
    return await transfer.moneyTransfer(pid, cid, body, user);
}, schema.transfer)