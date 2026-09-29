import { BotContext } from "../core/context";
import { MenuKeyboard } from "../keyboards/menu";
import { HistoryService } from "../services/history";
import { Step } from "../types";
import { EntityControllerFactory } from "./entity-factory";
import { replyOrEdit } from "./send-method";

export async function render(ctx: BotContext, step: Step, isCommand = false) {
    const entity = step?.entity;
    const history = new HistoryService(ctx);

    if(!entity) {
        history.setStartStep();

        const welcomeMsg = ctx.t('start');
        const options = {
            reply_markup: MenuKeyboard.mainMenu(),
        }
        
        const method = replyOrEdit(ctx, isCommand);
        await method(welcomeMsg, options);

        return;
    }

    history.add(step)

    const handler = EntityControllerFactory.create(entity);

    await handler.render(ctx, step, isCommand)
}