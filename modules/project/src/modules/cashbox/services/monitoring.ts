import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { UserService } from "../../../../../auth/src/modules/user/services";
import { BudgetService } from "../../budget/services";
import { NotificationService } from "../../notification/service";
import { ProjectService } from "../../project/services";
import { SettingService } from "../../setting/services/setting";
import { CashboxService } from "./cashbox";

export class CashboxMonitoringService {
    constructor (
        private userService: UserService,
        private projectService: ProjectService,
        private cashboxService: CashboxService,
        private cashboxSettingService: SettingService,
        private projectSettingService: SettingService,
        private budgetService: BudgetService,
        private notificationService: NotificationService
    ) {}

    public async checkBalance(cashboxId: number, user: UserEntity, projectId: number) {
        const cashbox = await this.cashboxService.getById(cashboxId, user, projectId);
        const curBalance = cashbox.getBalance();
        
        const activeBudget = await this.budgetService.getActive(cashboxId, user, projectId);

        if(!activeBudget) return;

        const projectSettings = await this.projectSettingService.getAll(projectId, user);
        const doNotifyGlobal = projectSettings.find(i => i.code  === 'notification');

        if(
            !doNotifyGlobal ||
            !doNotifyGlobal.value
        ) return;

        const cashboxSettings = await this.cashboxSettingService.getAll(cashboxId, user, projectId);
        const doNotify = cashboxSettings.find(i => i.code  === 'notification1');
        const notifyAmount = cashboxSettings.find(i => i.code  === 'notification_amount');

        if(
            !doNotify || 
            !doNotify.value || 
            !notifyAmount || 
            !notifyAmount.value
        ) return;
        
        const project = await this.projectService.getById(projectId);
        const projectOwner = await this.userService.getUser(project.getOwner());

        if(curBalance.lt(0)) {
            await this.notificationService.notifyAboutNegativeBalance(projectOwner, cashbox);
        } else if(curBalance.lte(notifyAmount.value)) {
            await this.notificationService.notifyAboutLessAmountBalance(projectOwner, cashbox, notifyAmount.value);
        }
        
        return;
    }
}