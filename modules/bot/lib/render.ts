import { BotContext } from "../core/context";
import { MenuKeyboard } from "../keyboards/menu";
import { HistoryService } from "../services/history";
import { Step } from "../types";
import { EntityControllerFactory } from "./factory";
import { replyOrEdit } from "./send-method";
import { cashboxConfig } from "../entities/cashbox/config";
import { cashboxServiceTg } from "../entities/cashbox/service";
import { cashboxKeyboard } from "../entities/cashbox/keyboard";

async function render(ctx: BotContext, step: Step, isCommand = false) {
    const entity = step?.entity;
    const history = new HistoryService(ctx);

    if(!entity) {
        history.setStartStep();

        const welcomeMsg = 'Начало';
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

async function renderListForChoice(ctx: BotContext, page: number, currentId: number) {
    const filter = cashboxConfig.getFilter(ctx);
    filter.id = {not: currentId};

    const params = {
        page, 
        limit: 5,
        fieldFilter: filter
    }

    const flags = {
        withBackButton: false
    };

    const data = await cashboxServiceTg.getList(params); 

    return cashboxKeyboard.list(data, flags);
}

export {
    render,
    renderListForChoice
}