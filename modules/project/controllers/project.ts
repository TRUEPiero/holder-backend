import {Elysia} from 'elysia';
import { ProjectService } from '../services/project';

const service = new ProjectService();

export const ProjectController = new Elysia({
    prefix: '/project'
})
.get('/', async({user}) => {
    return await service.getUserProjects(user);
})
.get('/default', async({user}) => {
    return await service.getDefaultProject(user) || {};
})
