import {Elysia} from 'elysia';
import { deriveUser } from '@plugins/deriveUser';
import { DirectoryService } from '@shared/DirectoryService';
import { ProjectRepository } from './repository';
import { ProjectService } from './services';
import { schema } from './schemas';

const base = new DirectoryService<'project'>('project', ['owner']);
const repo = new ProjectRepository(base);

const service = new ProjectService(repo);

export const ProjectController = new Elysia({
    prefix: '/project'
})
.derive(deriveUser)

.get('/', async({user}) => {
    const projects = await service.getUserProjects(user);
    return {data: projects}
}, schema.getAll)

.get('/:pid', async({params: {pid}, status}) => {
    try{
        const project = await service.getDetailProject(pid);
        return {data: project}
    } catch(e: any) {
        if(e.message === 'PROJECT_NOT_FOUND') return status(404, {code: "PROJECT_NOT_FOUND", description: 'Project by ID not founded'});
        return status (500, {code: 'ERROR', description: JSON.stringify(e)}) 
    } 

}, schema.detail)

.post('/', async({user, body, status}) => {
    try{
        const project =  await service.createProject(user, body)
        return {data: project}
    } catch(e: any) {
        if(e.message === 'PROJECT_NOT_CREATED') return status(500, {code: "PROJECT_NOT_CREATED", description: "Error while create project"})
    } 
}, schema.create)

.patch('/:pid', async({params: {pid}, body, status}) => {
    try{
        const project =  await service.updateProject(pid, body);
        return {data: project}
    } catch(e: any) {
        if(e.message === 'PROJECT_NOT_FOUND') return status(404, {code: "PROJECT_NOT_FOUND", description: "Project by ID not founded"});
        return status(500, {code: "PROJECT_NOT_UPDATED", description: "Error while updates project"});
    } 
}, schema.update)

.delete('/:pid', async({params: {pid}}) => {
    const project =  await service.deleteProject(pid)
    return {data: project}
}, schema.delete)