import { UserService } from "../../auth/src/modules/user/services"
import { SettingService } from "../../project/src/modules/settings/services"
import { BotContext } from "../core/context"
import { ProjectService } from "../../project/src/modules/project/services";
import { CashboxService } from "../../project/src/modules/cashbox/services";
import { MembershipService } from "../../project/src/modules/member/services/membership";
import { TransactionService } from "../../project/src/modules/transaction/services/transaction";

type ServiceMap = {
  project: ProjectService;
  cashbox: CashboxService;
  member: MembershipService;
  transaction: TransactionService;
};

interface EntityService<K extends keyof ServiceMap> {
    baseService: ServiceMap[K];
    userService: UserService
    settingService: SettingService | null

    getItem(id: number): Promise<any>
    getList(filter: any): Promise<any>
    getSettings(id: number): Promise<any>
    create(ctx: BotContext): any
    update(ctx: BotContext): any
    delete(ctx: BotContext): any
}

export {
    EntityService
}