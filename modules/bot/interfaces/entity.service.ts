import { BotContext } from "../core/context"
import { container } from "../../containers";

const {userService, projectService, cashboxService, memberService, transactionService} = container

type ServiceMap = {
  project: typeof projectService;
  cashbox: typeof cashboxService;
  member: typeof memberService;
  transaction: typeof transactionService;
};

interface EntityService<K extends keyof ServiceMap> {
    baseService: ServiceMap[K];
    userService: typeof userService
    getItem(ctx: BotContext): Promise<any>
    getList(filter: any): Promise<any>
    create(ctx: BotContext): any
    update(ctx: BotContext): any
    delete(ctx: BotContext): any
}

export {
    EntityService
}