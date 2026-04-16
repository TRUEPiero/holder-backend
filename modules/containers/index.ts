import { DirectoryService } from "@shared/DirectoryService";

import { MailService } from "../auth/lib/mail";

// auth
import { UserRepository } from "../auth/src/modules/user/repository";
import { UserService } from "../auth/src/modules/user/services";
import { AuthService } from "../auth/src/modules/auth/services";
import { RegisterRepository } from "../auth/src/modules/register/repository";
import { RegisterService } from "../auth/src/modules/register/services";
// project
import { ProjectRepository } from "../project/src/modules/project/repository";
import { ProjectService } from "../project/src/modules/project/services";

import { CashboxRepository } from "../project/src/modules/cashbox/repository";
import { CashboxService } from "../project/src/modules/cashbox/services";

import { CashboxSettingsRepository } from "../project/src/modules/cashboxSetting/repositories";
import { CashboxSettingsService } from "../project/src/modules/cashboxSetting/services";

import { TransactionRepository } from "../project/src/modules/transaction/repository";
import { TransactionService } from "../project/src/modules/transaction/services/transaction";
import { TransferService } from "../project/src/modules/transaction/services/transfer";

import { MembershipRepository } from "../project/src/modules/member/repositories/membership";
import { MembershipService } from "../project/src/modules/member/services/membership";

import { ProjectInviteService } from "../project/src/modules/member/services/invite";

import { SettingRepository } from "../project/src/modules/projectSetting/repositories/setting";
import { SettingService } from "../project/src/modules/projectSetting/services/settings";

import { InviteRepository } from "../project/src/modules/member/repositories/invite";

const mainService = new MailService();

// bases
const userBase = new DirectoryService<'user'>('user', []);
const registerBase = new DirectoryService<'registerVerify'>('registerVerify', []);
const projectBase = new DirectoryService<'project'>('project', ['owner']);
const cashboxBase = new DirectoryService<'cashbox'>('cashbox', ['project']);
const cashboxSettingBase = new DirectoryService<'cashboxSetting'>('cashboxSetting', [])
const transactionBase = new DirectoryService<'transaction'>('transaction', ['cashbox']);
const settingBase = new DirectoryService<'projectSetting'>('projectSetting', [])
const memberBase = new DirectoryService<'projectMember'>('projectMember', ['user', 'project'])
const inviteBase = new DirectoryService<'projectInvite'>('projectInvite', [])

// repos
const userRepo = new UserRepository(userBase);
const registerRepo = new RegisterRepository(registerBase);
const projectRepo = new ProjectRepository(projectBase);
const cashboxRepo = new CashboxRepository(cashboxBase);
const cashboxSettingRepo = new CashboxSettingsRepository(cashboxSettingBase);
const transactionRepo = new TransactionRepository(transactionBase)
const settingRepo = new SettingRepository(settingBase)
const memberRepo = new MembershipRepository(memberBase);
const inviteRepo = new InviteRepository(inviteBase);

// services
const userService = new UserService(userRepo);
const authService = new AuthService(userRepo);
const registerService = new RegisterService(registerRepo, userRepo, mainService);
const projectService = new ProjectService(projectRepo, userService);
const cashboxService = new CashboxService(cashboxRepo, projectService);
const cashboxSettingService = new CashboxSettingsService(cashboxSettingRepo, cashboxService);
const transactionService = new TransactionService(transactionRepo, projectService)
const transferService = new TransferService(cashboxService, transactionRepo, projectService)
const memberService = new MembershipService(memberRepo, projectService);
const projectSettingService = new SettingService(settingRepo, projectService)
const inviteService = new ProjectInviteService(inviteRepo, userRepo, memberService)

export const container = {
    userService,
    authService,
    registerService,
    projectService,
    cashboxService,
    cashboxSettingService,
    transactionService,
    transferService,
    memberService,
    inviteService,
    projectSettingService,
};