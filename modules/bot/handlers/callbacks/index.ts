import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { HistoryService } from "../../services/history";
import { render } from "../../lib/render";
import { EntityType } from "../../types";

const composer = new Composer<BotContext>();


composer.callbackQuery(/^(project|cashbox)_(\d+)$/, async(ctx) => {
    const entity = ctx.match[1] as EntityType;
    const id = Number(ctx.match[2]);

    const step = {
        entity, 
        type: 'item',
        id
    }

    await render(ctx, step)
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox|transaction)_page_(\d+)$/, async(ctx) => {
    const entity = ctx.match[1] as EntityType
    const id = Number(ctx.match[2]);

    const step = {
        entity, 
        type: 'page',
        id
    }

    await render(ctx, step);
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox)_create/, async(ctx) => {
    await ctx.scenes.enter('createEntity'); 
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox)_settings_(\d+)$/, async(ctx) => {
    const entity = ctx.match[1] as EntityType;
    const id = Number(ctx.match[2]);

    const step = {
        entity, 
        type: 'settings',
        id
    }
    await render(ctx, step)
    await ctx.answerCallbackQuery();
})

composer.callbackQuery('back', async(ctx) => {
    const history = new HistoryService(ctx);
    const backstep = history.getPreviosStep();

    await render(ctx, backstep)
    await ctx.answerCallbackQuery();
})

export default composer;
