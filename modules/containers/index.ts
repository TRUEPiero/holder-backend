import { DirectoryService } from "@services/DirectoryService";

import { MailService } from "../user/src/lib/mail";
import { CasheService } from "@services/CasheService";
import { TelegramLinkService } from "../user/src/common/services/telegramLink";

// auth
import { UserRepository } from "../user/src/modules/user/repository";
import { UserService } from "../user/src/modules/user/services";
import { AuthService } from "../user/src/modules/auth/services";
import { RegisterRepository } from "../user/src/modules/register/repository";
import { RegisterService } from "../user/src/modules/register/services";
// project
import { ProjectRepository } from "../project/src/modules/project/repositories/project";
import { ProjectService } from "../project/src/modules/project/services";

import { CashboxRepository } from "../project/src/modules/cashbox/repositories/cashbox";
import { CashboxService } from "../project/src/modules/cashbox/services/cashbox";

import { TransactionTagRepository } from "../project/src/modules/transaction/repositories/tag";
import { TransactionTagService } from "../project/src/modules/transaction/services/tag";

import { TransactionRepository } from "../project/src/modules/transaction/repositories/transaction";
import { TransactionService } from "../project/src/modules/transaction/services/transaction";
import { TransferService } from "../project/src/modules/transaction/services/transfer";

import { BudgetRepository } from "../project/src/modules/budget/repository";
import { BudgetService } from "../project/src/modules/budget/services";

import { MemberRoleService } from "../project/src/modules/member/services/role";
import { MemberRoleRepository } from "../project/src/modules/member/repositories/role";

import { MembershipRepository } from "../project/src/modules/member/repositories/membership";
import { MembershipService } from "../project/src/modules/member/services/membership";

import { InviteRepository } from "../project/src/modules/member/repositories/invite";
import { ProjectInviteService } from "../project/src/modules/member/services/invite";

import { ProjectSettingRepository } from "../project/src/modules/setting/repositories/project";
import { ProjectSettingValueService } from "../project/src/modules/setting/services/project";
import { CashboxSettingRepository } from "../project/src/modules/setting/repositories/cashbox";
import { CashboxSettingValuesService } from "../project/src/modules/setting/services/cashbox";
import { UserSettingRepository } from "../project/src/modules/setting/repositories/user";
import { UserSettingValuesService } from "../project/src/modules/setting/services/user";

import { SettingRepository } from "../project/src/modules/setting/repositories/setting";
import { SettingService } from "../project/src/modules/setting/services/setting";
import { SettingGroupService } from "../project/src/modules/setting/services/group";
import { SettingGroupRepository } from "../project/src/modules/setting/repositories/group";
import { MonitoringService } from "../project/src/modules/notification/services/monitoring";
import { NotificationService } from "../project/src/modules/notification/services/notify";
import { EventService } from "../events/src/service";
import { EventRepository } from "../events/src/repository";

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
const userSettingBase = new DirectoryService<'userSettings'>('userSettings', []);
const projectSettingBase = new DirectoryService<'projectSettings'>('projectSettings', []);
const cashboxSettingBase = new DirectoryService<'cashboxSettings'>('cashboxSettings', []);
const transactionBase = new DirectoryService<'transaction'>('transaction', ['cashbox', 'author', 'tag']);
const transactionTagBase = new DirectoryService<'transactionTag'>('transactionTag', []);

const eventBase = new DirectoryService<'events'>('events', []);

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
const userSettingRepo = new UserSettingRepository(userSettingBase);

const settingRepo = new SettingRepository(settingBase);
const settingGroupRepo = new SettingGroupRepository(settingGroupBase)
const transactionRepo = new TransactionRepository(transactionBase);
const transactionTagRepo = new TransactionTagRepository(transactionTagBase);

const eventRepository = new EventRepository(eventBase);

// services
const casheService = new CasheService();
const notificationService = new NotificationService();

const userService = new UserService(userRepo);
const telegramLinkService = new TelegramLinkService(casheService, userRepo);
const authService = new AuthService(userService);
const registerService = new RegisterService(registerRepo, userService, mainService);

const projectService = new ProjectService(projectRepo, casheService);

const memberRoleService = new MemberRoleService(memberRoleRepo);
const memberService = new MembershipService(memberRepo, projectService, memberRoleService,casheService);
const inviteService = new ProjectInviteService(inviteRepo, userService, memberService, projectService)

const cashboxService = new CashboxService(cashboxRepo, projectService, casheService);

const budgetService = new BudgetService(budgetRepo, projectService, cashboxRepo);

const cashboxSettingValuesService = new CashboxSettingValuesService(cashboxSettingRepo, projectService, casheService, cashboxRepo);
const projectSettingValuesService = new ProjectSettingValueService(projectSettingRepo, projectService, casheService);
const userSettingValuesService = new UserSettingValuesService(userSettingRepo);

const cashboxSettingService = new SettingService(settingRepo, cashboxService, cashboxSettingValuesService);
const projectSettingService = new SettingService(settingRepo, projectService, projectSettingValuesService);
const userSettingService = new SettingService(settingRepo, projectService, userSettingValuesService);

const projectSettingGroupService = new SettingGroupService(settingGroupRepo, projectService)
const cashboxSettingGroupService = new SettingGroupService(settingGroupRepo, cashboxService)
const userSettingGroupService = new SettingGroupService(settingGroupRepo, userService)

const monitoringService = new MonitoringService(userService, projectService, cashboxService, cashboxSettingService, projectSettingService, budgetService, notificationService)

const transactionService = new TransactionService(transactionRepo, projectService, casheService);
const transactionTagService = new TransactionTagService(transactionTagRepo, projectService);
const transferService = new TransferService(projectService, monitoringService, casheService);

const eventService = new EventService(eventRepository);

export const container = {
    casheService,

    userService,
    telegramLinkService,
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
    userSettingService,
    projectSettingGroupService,
    cashboxSettingGroupService,
    userSettingGroupService,
    eventService
};
