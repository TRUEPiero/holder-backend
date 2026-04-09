import {Elysia, t} from 'elysia';
import { schema } from './schemas';
import { CashboxService } from './services';
import { DirectoryService } from '@shared/DirectoryService';
import { CashboxRepository } from './repository';

const base = new DirectoryService<'cashbox'>('cashbox', [])
const repo = new CashboxRepository(base);

const service = new CashboxService(repo);

export const CashboxController = new Elysia({
    prefix: '/project/:pid/cashbox'
})

.get('/', async ({params: {pid}}) => {
    const cashboxes = await service.getByProject(pid);
    return {data: cashboxes}
},schema.getAll)

.get('/:cid', async({params: {pid, cid}}) => {
    const cashbox = await service.getDetail(cid);
    return {data: cashbox}
}, schema.detail)

.post('/', async({params: {pid}, body, status}) => {
    try {
        const cashbox = await service.create(pid, body);
        return {data: cashbox}
    } catch (error: any) {
        if(error.message === 'PROJECT_NOT_FOUND') return status(404, {code: 'PROJECT_NOT_FOUND', description: ''});
        return status(500, {code: 'CASHBOX_NOT_CREATED', description: ''});
    }
}, schema.create)

.patch('/:cid', async({params: {pid, cid}, body, status}) => {
    try {
        const cashbox = await service.update(cid, body);
        return {data: cashbox}
    } catch (error: any) {
        if(error.message === 'CASHBOX_NOT_FOUND') return status(404, {code: 'CASHBOX_NOT_FOUND', description: ''});
        return status(500, {code: 'CASHBOX_NOT_UPDATED', description: ""});
    }
}, schema.update)

.delete('/:cid', async({params: {pid, cid}, status}) => {
    try {
        const cashbox = await service.delete(cid);
        return {data: cashbox}
    } catch (error: any) {
        if(error.message === 'CASHBOX_NOT_FOUND') return status(404, {code: 'CASHBOX_NOT_FOUND', description: ''});
        return status(500, {code: 'CASHBOX_NOT_DELETED', description: ""});
    }
}, schema.delete)
