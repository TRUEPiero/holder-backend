import {Elysia, status} from 'elysia';
import { ProjectService } from '../services/project';

const service = new ProjectService();

export const ProjectController = new Elysia({
    prefix: '/project'
})
.get('/', async({user, status}) => {
    return await service.getUserProjects(user, status);
})
.get('/default', async({user, status}) => {
    return await service.getDefaultProject(user, status) || {};
})
