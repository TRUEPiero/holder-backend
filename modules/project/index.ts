import {Elysia} from 'elysia';
import { deriveUser } from '../../src/plugins/deriveUser';
import { ProjectController } from './controllers/project';

export const app = new Elysia()
.derive(deriveUser)
.use(ProjectController)
