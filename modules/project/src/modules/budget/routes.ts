import {Elysia} from 'elysia';
import { deriveUser } from '@plugins/deriveUser';
import { container } from '../../../../containers';
import { schema } from './schemas';

const { budgetService } = container

export const BudgetController = new Elysia({
    prefix: 'project/:pid/cashbox/:cid/budget'
})

.derive(deriveUser)

.get('/', async({params: {pid, cid}, user}) => {
    const budget = await budgetService.getActive(cid, user, pid);
    return {data: budget?.response() || null}
}, schema.getActive)

.get('/history', async({params: {pid, cid}, user}) => {
    const budget = await budgetService.getHistory(cid, user, pid);
    return {data: budget}
}, schema.history)

.post('/', async({params: {pid, cid}, user, body}) => {
    const budget = await budgetService.create(user, body, cid, pid);
    return {data: budget.response()}
}, schema.create)

.patch('/:bid', async({params: {pid, cid, bid}, user, body}) => {
    const budget = await budgetService.update(bid, user, body, cid, pid);
    return {data: budget.response()}
}, schema.update)