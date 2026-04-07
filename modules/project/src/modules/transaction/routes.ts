import { Elysia, t } from 'elysia'
import { schema } from './schemas';
import { deriveUser } from '@plugins/deriveUser';
import { TransactionService } from './services/transaction'
import { TransferService } from './services/transfer';
import { DirectoryService } from '@shared/DirectoryService';
import { TransactionRepository } from './repository';

const base = new DirectoryService<'transaction'>('transaction', [])
const repo = new TransactionRepository(base)

const service = new TransactionService(repo);
const transfer = new TransferService();

export const TransactionController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/transaction'
})
.derive(deriveUser)

.get('/', async({params: {pid, cid}, query}) => {
    const transactions = await service.getCashboxTransactions(pid, cid, query)
    return {data: transactions}
}, schema.get)

.post('/transfer', async({params: {pid, cid}, body, user}) => {
    return await transfer.moneyTransfer(pid, cid, body, user);
}, schema.transfer)