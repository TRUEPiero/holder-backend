import {Elysia} from 'elysia';
import { deriveUser } from '@plugins/deriveUser';
import { schema } from './schemas';
import { container } from '../../../../containers';

const {projectService, transactionTagService} = container;

export const ProjectController = new Elysia({
    prefix: '/project'
})
.derive(deriveUser)

.get('/', async({user}) => {
    const projects = await projectService.getByUser(user);
    return {data: projects}
}, schema.getAll)

.get('/:pid', async({params: {pid}, user}) => {
    const project = await projectService.authorize(pid, user, 'project:read');
    return {data: project.response()}
}, schema.detail)

.get('/:pid/tags', async({params: {pid}, user}) => {
    const tags = await transactionTagService.getByProject(pid, user);
    return {data: tags};
}, schema.tags)

.post('/', async({user, body}) => {
    const project =  await projectService.create(user, body)
    return {data: project.response()}
}, schema.create)

.patch('/:pid', async({params: {pid}, user, body}) => {
    const project =  await projectService.update(pid, user,body);
    return {data: project.response()}
}, schema.update)

.delete('/:pid', async({params: {pid}, user}) => {
    const project =  await projectService.delete(pid, user)
    return {data: project.response()}
}, schema.delete)