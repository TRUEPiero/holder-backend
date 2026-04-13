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

import { TransactionRepository } from "../project/src/modules/transaction/repository";
import { TransactionService } from "../project/src/modules/transaction/services/transaction";
import { TransferService } from "../project/src/modules/transaction/services/transfer";

import { MembershipRepository } from "../project/src/modules/member/repositories/membership";
import { MembershipService } from "../project/src/modules/member/services/membership";

import { ProjectInviteService } from "../project/src/modules/member/services/invite";

import { SettingRepository } from "../project/src/modules/setting/repositories/setting";
import { SettingService } from "../project/src/modules/setting/services/settings";
import { InviteRepository } from "../project/src/modules/member/repository";

const mainService = new MailService();

// bases
const userBase = new DirectoryService<'user'>('user', []);
const registerBase = new DirectoryService<'registerVerify'>('registerVerify', []);
const projectBase = new DirectoryService<'project'>('project', ['cashbox']);
const cashboxBase = new DirectoryService<'cashbox'>('cashbox', []);
const transactionBase = new DirectoryService<'transaction'>('transaction', []);
const settingBase = new DirectoryService<'projectSetting'>('projectSetting', ['values'])
const memberBase = new DirectoryService<'projectMember'>('projectMember', ['user', 'project'])
const inviteBase = new DirectoryService<'projectInvite'>('projectInvite', [])

// repos
const userRepo = new UserRepository(userBase);
const registerRepo = new RegisterRepository(registerBase);
const projectRepo = new ProjectRepository(projectBase);
const cashboxRepo = new CashboxRepository(cashboxBase);
const transactionRepo = new TransactionRepository(transactionBase)
const settingRepo = new SettingRepository(settingBase)
const memberRepo = new MembershipRepository(memberBase);
const inviteRepo = new InviteRepository(inviteBase);

// services
const userService = new UserService(userRepo);
const authService = new AuthService(userRepo);
const registerService = new RegisterService(registerRepo, userRepo, mainService);
const projectService = new ProjectService(projectRepo, userService);
const cashboxService = new CashboxService(cashboxRepo);
const transactionService = new TransactionService(transactionRepo)
const transferService = new TransferService(cashboxRepo, transactionRepo)
const memberService = new MembershipService(memberRepo);
const settingService = new SettingService(settingRepo, projectService)
const inviteService = new ProjectInviteService(inviteRepo, userRepo, memberService)

export const container = {
    userService,
    authService,
    registerService,
    projectService,
    cashboxService,
    transactionService,
    transferService,
    memberService,
    inviteService,
    settingService,
};