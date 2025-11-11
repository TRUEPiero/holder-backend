import {Elysia} from 'elysia';
import { deriveUser } from '../../shared/deriveUser';
import { ProjectController } from './controllers/project';

export const app = new Elysia()
.derive(deriveUser)
.use(ProjectController)
