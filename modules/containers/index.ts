import { DirectoryService } from "@services/DirectoryService";

import { MailService } from "../auth/src/lib/mail";
import { CasheService } from "@services/CasheService";

// auth
import { UserRepository } from "../auth/src/modules/user/repository";
import { UserService } from "../auth/src/modules/user/services";
import { AuthService } from "../auth/src/modules/auth/services";
import { RegisterRepository } from "../auth/src/modules/register/repository";
import { RegisterService } from "../auth/src/modules/register/services";
// project
import { ProjectRepository } from "../project/src/modules/project/repositories/project";
import { ProjectService } from "../project/src/modules/project/services";

import { CashboxRepository } from "../project/src/modules/cashbox/repositories/cashbox";
import { CashboxService } from "../project/src/modules/cashbox/services";

import { TransactionRepository } from "../project/src/modules/transaction/repositories/transaction";
import { TransactionService } from "../project/src/modules/transaction/services/transaction";
import { TransferService } from "../project/src/modules/transaction/services/transfer";

import { MembershipRepository } from "../project/src/modules/member/repositories/membership";
import { MembershipService } from "../project/src/modules/member/services/membership";

import { InviteRepository } from "../project/src/modules/member/repositories/invite";
import { ProjectInviteService } from "../project/src/modules/member/services/invite";

import { SettingRepository } from "../project/src/modules/setting/repositories/setting";
import { SettingService } from "../project/src/modules/setting/services/setting";
import { SettingGroupService } from "../project/src/modules/setting/services/group";
import { SettingGroupRepository } from "../project/src/modules/setting/repositories/group";

import { TransactionTagRepository } from "../project/src/modules/transaction/repositories/tag";
import { TransactionTagService } from "../project/src/modules/transaction/services/tag";

import { MemberRoleService } from "../project/src/modules/member/services/role";
import { MemberRoleRepository } from "../project/src/modules/member/repositories/role";
import { ProjectSettingRepository } from "../project/src/modules/project/repositories/settings";
import { CashboxSettingRepository } from "../project/src/modules/cashbox/repositories/settings";
import { BudgetService } from "../project/src/modules/budget/services";
import { BudgetRepository } from "../project/src/modules/budget/repository";

const mainService = new MailService();

// bases
const userBase = new DirectoryService<'user'>('user', []);
const registerBase = new DirectoryService<'registerVerify'>('registerVerify', []);

const projectBase = new DirectoryService<'project'>('project', ['owner']);
const memberRoleBase = new DirectoryService<'memberRole'>('memberRole', [])
const memberBase = new DirectoryService<'projectMember'>('projectMember', ['user', 'project']);
const inviteBase = new DirectoryService<'projectInvite'>('projectInvite', []);
const cashboxBase = new DirectoryService<'cashbox'>('cashbox', ['project']);
const budgetBase = new DirectoryService<'cashboxBudget'>('cashboxBudget', ['cashbox'])
const settingBase = new DirectoryService<'settingDefinition'>('settingDefinition', []);
const settingGroupBase = new DirectoryService<'settingGroup'>('settingGroup', []);
const projectSettingBase = new DirectoryService<'projectSettings'>('projectSettings', []);
const cashboxSettingBase = new DirectoryService<'cashboxSettings'>('cashboxSettings', []);
const transactionBase = new DirectoryService<'transaction'>('transaction', ['cashbox', 'author', 'tag']);
const transactionTagBase = new DirectoryService<'transactionTag'>('transactionTag', []);

// repos
const userRepo = new UserRepository(userBase);
const registerRepo = new RegisterRepository(registerBase);

const projectRepo = new ProjectRepository(projectBase);
const memberRoleRepo = new MemberRoleRepository(memberRoleBase)
const memberRepo = new MembershipRepository(memberBase);
const inviteRepo = new InviteRepository(inviteBase);
const cashboxRepo = new CashboxRepository(cashboxBase);
const budgetRepo = new BudgetRepository(budgetBase);
const projectSettingRepo = new ProjectSettingRepository(projectSettingBase);
const cashboxSettingRepo = new CashboxSettingRepository(cashboxSettingBase);
const settingRepo = new SettingRepository(settingBase);
const settingGroupRepo = new SettingGroupRepository(settingGroupBase)
const transactionRepo = new TransactionRepository(transactionBase);
const transactionTagRepo = new TransactionTagRepository(transactionTagBase);

// services
const casheService = new CasheService();

const userService = new UserService(userRepo);
const authService = new AuthService(userService);
const registerService = new RegisterService(registerRepo, userService, mainService);

const projectService = new ProjectService(projectRepo, projectSettingRepo, casheService);
const memberRoleService = new MemberRoleService(memberRoleRepo);
const memberService = new MembershipService(memberRepo, projectService, memberRoleService,casheService);
const inviteService = new ProjectInviteService(inviteRepo, userService, memberService, projectService)
const cashboxService = new CashboxService(cashboxRepo, projectService, cashboxSettingRepo, casheService);
const transactionService = new TransactionService(transactionRepo, casheService, projectService);
const transactionTagService = new TransactionTagService(transactionTagRepo, projectService);
const transferService = new TransferService(casheService, projectService);
const budgetService = new BudgetService(budgetRepo, projectService);
const cashboxSettingService = new SettingService(settingRepo, cashboxService);
const projectSettingService = new SettingService(settingRepo, projectService);
const projectSettingGroupService = new SettingGroupService(settingGroupRepo, projectService)
const cashboxSettingGroupService = new SettingGroupService(settingGroupRepo, cashboxService)

export const container = {
    casheService,

    userService,
    authService,
    registerService,
    projectService,
    cashboxService,
    budgetService,
    transactionService,
    transactionTagService,
    transferService,
    memberService,
    inviteService,
    projectSettingService,
    cashboxSettingService,
    projectSettingGroupService,
    cashboxSettingGroupService
};