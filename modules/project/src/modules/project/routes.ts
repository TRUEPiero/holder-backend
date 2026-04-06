import {Elysia} from 'elysia';
import { ProjectService } from './services';
import { schema } from './schemas';
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
    try{
        return await service.getDetailProject(pid);
    } catch(e: any) {
        if(e.message === 'PROJECT_UNDEFINED') return status(404, {code: "PROJECT_UNDEFINED", description: 'Project by ID not founded'}); 
    } 

}, schema.detail)

.post('/', async({user, body, status}) => {
    try{
        return service.createProject(user, body)
    } catch(e: any) {
        if(e.message === 'PROJECT_NOT_CREATED') return status(500, {code: "PROJECT_NOT_CREATED", description: "Error while create project"})
    } 
}, schema.create)

.patch('/:pid', async({params: {pid}, body, status}) => {
    
    try{
        return await service.updateProject(pid, body);
    } catch(e: any) {
        if(e.message === 'PROJECT_UNDEFINED') return status(404, {code: "PROJECT_UNDEFINED", description: "Project by ID not founded"});
        return status(500, {code: "UPDATE_FAILED", description: "Error while updates project"});
    } 
}, schema.update)

.delete('/:pid', async({params: {pid}}) => {
    return await service.deleteProject(pid)
}, schema.delete)