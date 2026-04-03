import {Elysia, t} from 'elysia';
import { ProjectService } from '../services/project';
import { schema } from '../schemas/project';
import { deriveUser } from '@plugins/deriveUser';

const service = new ProjectService();

export const ProjectController = new Elysia({
    prefix: '/project'
})
.derive(deriveUser)

.get('/', async({user}) => {
    return await service.getUserProjects(user);
}, schema.getAll)

.get('/:pid', async({params: {pid}, status}) => {
    return (await service.getDetailProject(pid)).data ||  status(404, {error: 'Project not found'});
}, schema.detail)

.post('/', async({user, body}) => {
    const params = {
        ...body,
        owner: user.id
    }
    return await service.createItem(params);
}, schema.create)

.patch('/:pid', async({params: {pid}, body}) => {
    return await service.updateProject(pid, body);
}, schema.update)

.delete('/:pid', async({params: {pid}}) => {
    return await service.deleteItem(pid)
}, schema.delete)