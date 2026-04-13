import { BotContext } from "../core/context";
import { CashboxHandler } from "../entities/cashbox.handler";
import { ProjectHandler } from "../entities/project.handler";
import { TransactionHandler } from "../entities/transaction.handler";

export class EntityHandlerFactory {
    static create(ctx: BotContext, entity: string) {
        switch (entity) {
        case "project":
            return new ProjectHandler(ctx);
        case "cashbox":
            return new CashboxHandler(ctx);
        case "transaction":
            return new TransactionHandler(ctx);
        default:
            return null;
        }
    }
}