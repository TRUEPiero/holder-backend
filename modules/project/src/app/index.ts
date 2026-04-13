import {Elysia} from 'elysia';
import { deriveUser } from '@plugins/deriveUser';
import { ProjectController } from '../modules/project/routes';
import { CashboxController } from '../modules/cashbox/routes';
import { TransactionController } from '../modules/transaction/routes';
import { MembershipController } from '../modules/member/routes';
import { ProjectSettingsController } from '../modules/setting/routes';

export const app = new Elysia()
.derive(deriveUser)
.use(ProjectController)
.use(CashboxController)
.use(TransactionController)
.use(MembershipController)
.use(ProjectSettingsController)