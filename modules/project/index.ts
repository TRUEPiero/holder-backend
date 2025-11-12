import {Elysia} from 'elysia';
import { deriveUser } from '@plugins/deriveUser';
import { ProjectController } from './controllers/project';
import { CashboxApp } from './controllers/cashbox';

export const app = new Elysia()
.derive(deriveUser)
.use(ProjectController)
.use(CashboxApp)
