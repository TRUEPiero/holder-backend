import {Elysia, t} from 'elysia';
import { ProjectService } from '../services/project';

const service = new ProjectService();

export const ProjectController = new Elysia({
    prefix: '/project'
})
.get('/', async({user}) => {
    return (await service.getUserProjects(user)).data;
})
.get('/default', async({user}) => {
    return await service.getDefaultProject(user);
})
.get('/:pid', async({params: {pid}}) => {
    return await service.getDetailProject(pid) || {};
}, {
    params: t.Object({
        pid: t.Number()
    })
})
.post('/', async({body}) => {
    return await service.createItem(body);
})
.patch('/:pid', async({params: {pid}, body}) => {
    return await service.updateProject(pid, body);
})
.delete('/:pid', async({params: {pid}}) => {
    return await service.deleteItem(pid)
}, {
    params: t.Object({
        pid: t.Number()
    })
})