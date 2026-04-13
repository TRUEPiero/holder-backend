import { BotContext } from "../core/context";
import { MenuKeyboard } from "../keyboards/menu";
import { HistoryService } from "../services/history";
import { Step } from "../types";
import { EntityHandlerFactory } from "./factory";

export const render = async (ctx: BotContext, step: Step, isCommand = false) => {
    const entity = step?.entity || '';
    const handler = EntityHandlerFactory.create(ctx, entity);

    const history = new HistoryService(ctx);
    history.add(step)

    if(!handler) {
        history.setStartStep();

        const welcomeMsg = 'Начало';
        const options = {
            reply_markup: MenuKeyboard.mainMenu(),
        }
        
        return isCommand ? await ctx.reply(welcomeMsg, options) : await ctx.editMessageText(welcomeMsg, options);
    }

    await handler.render(step)
}