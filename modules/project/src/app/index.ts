import {Elysia} from 'elysia';
import { ProjectController } from '../modules/project/routes';
import { CashboxController } from '../modules/cashbox/routes';
import { TransactionController } from '../modules/transaction/routes';
import { MembershipController } from '../modules/member/routes';
import { SettingController } from '../modules/setting/routes';
import { BudgetController } from '../modules/budget/routes';

export const app = new Elysia()
.use(ProjectController)
.use(CashboxController)
.use(TransactionController)
.use(MembershipController)
.use(SettingController)
.use(BudgetController)