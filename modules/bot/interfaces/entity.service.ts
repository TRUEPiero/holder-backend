import { BotContext } from "../core/context"
import { container } from "../../containers";

const {userService, projectService, cashboxService, memberService, transactionService} = container

export type ServiceMap = {
  project: typeof projectService;
  cashbox: typeof cashboxService;
  member: typeof memberService;
  transaction: typeof transactionService;
  user: typeof userService;
};

interface BaseService<K extends keyof ServiceMap> {
    baseService: ServiceMap[K];
}

interface EntityService<K extends keyof ServiceMap> extends BaseService<K> {
    userService: typeof userService
    getItem(ctx: BotContext): Promise<any>
    getList(filter: any): Promise<any>
    create(ctx: BotContext): any
    update(ctx: BotContext): any
    delete(ctx: BotContext): any
}

export {
    BaseService,
    EntityService
}