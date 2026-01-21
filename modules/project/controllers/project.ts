import {Elysia, t} from 'elysia';
import { ProjectService } from '../services/project';
import { schema } from '../schemas/project';

const service = new ProjectService();

export const ProjectController = new Elysia({
    prefix: '/project'
})

.get('/', async({user}) => {
    return await service.getUserProjects(user);
}, schema.getAll)

.get('/default', async({user}) => {  
    return await service.getDefaultProject(user); 
}, schema.default)

.get('/:pid', async({params: {pid}, status}) => {
    const detailProject = await service.getDetailProject(pid);

    if(!detailProject?.data) return status(404, {error: 'Project not found'});
    return detailProject
}, schema.detail)

.post('/', async({body}) => {
    return await service.createItem(body);
}, schema.create)

.patch('/:pid', async({params: {pid}, body}) => {
    return await service.updateProject(pid, body);
}, schema.update)

.delete('/:pid', async({params: {pid}}) => {
    return await service.deleteItem(pid)
}, schema.delete)