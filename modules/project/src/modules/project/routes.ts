import {Elysia} from 'elysia';
import { deriveUser } from '@plugins/deriveUser';
import { DirectoryService } from '@shared/DirectoryService';
import { ProjectRepository } from './repository';
import { ProjectService } from './services';
import { schema } from './schemas';

const base = new DirectoryService<'project'>('project', ['owner', 'cashboxes']);
const repo = new ProjectRepository(base);

const service = new ProjectService(repo);

export const ProjectController = new Elysia({
    prefix: '/project'
})
.derive(deriveUser)

.get('/', async({user}) => {
    const projects = await service.getByUser(user);
    return {data: projects}
}, schema.getAll)

.get('/:pid', async({params: {pid}, status}) => {
    try{
        const project = await service.getDetail(pid);
        return {data: project}
    } catch(e: any) {
        if(e.message === 'PROJECT_NOT_FOUND') return status(404, {code: "PROJECT_NOT_FOUND", description: 'Project by ID not founded'});
        return status (500, {code: 'ERROR', description: JSON.stringify(e)}) 
    } 

}, schema.detail)

.post('/', async({user, body, status}) => {
    try{
        const project =  await service.create(user, body)
        return {data: project}
    } catch(e: any) {
        if(e.message === 'PROJECT_NOT_CREATED') return status(500, {code: "PROJECT_NOT_CREATED", description: "Error while create project"})
    } 
}, schema.create)

.patch('/:pid', async({params: {pid}, user, body, status}) => {
    try{
        const project =  await service.update(user, pid, body);
        return {data: project}
    } catch(e: any) {
        if(e.message === 'PROJECT_NOT_FOUND') return status(404, {code: "PROJECT_NOT_FOUND", description: "Project by ID not founded"});
        return status(500, {code: "PROJECT_NOT_UPDATED", description: JSON.stringify(e)});
    } 
}, schema.update)

.delete('/:pid', async({params: {pid}, user}) => {
    const project =  await service.delete(user, pid)
    return {data: project}
}, schema.delete)