import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { HistoryService } from "../../services/history";
import { render } from "../../lib/render";
import { EntityType, Step } from "../../types";

const composer = new Composer<BotContext>();


composer.callbackQuery(/^(project|cashbox|transaction|member)_(\d+)$/, async(ctx) => {
    const entity = ctx.match[1] as EntityType;
    const id = Number(ctx.match[2]);

    const step: Step = {
        entity, 
        type: 'item',
        id
    }

    await render(ctx, step)
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox|transaction|member)_page_(\d+)$/, async(ctx) => {
    const entity = ctx.match[1] as EntityType
    const id = Number(ctx.match[2]);

    const step: Step = {
        entity, 
        type: 'page',
        id
    }

    await render(ctx, step);
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox)_settings$/, async(ctx) => {
    const entity = ctx.match[1] as EntityType;
    const id = Number(ctx.match[2]);

    const step: Step = {
        entity, 
        type: 'settings',
        id
    }
    await render(ctx, step)
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox)_create$/, async(ctx) => {
    await ctx.scenes.enter('createEntity'); 
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox)_rename$/, async(ctx) => {
    await ctx.scenes.enter('renameEntity'); 
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox|transaction|member)_delete$/, async(ctx) => {
    await ctx.scenes.enter('deleteEntity'); 
    await ctx.answerCallbackQuery();
})

composer.callbackQuery(/^cashbox_transaction_(income|expense)$/, async(ctx) => {
    ctx.scenes.enter('moneyTransfer');
    ctx.answerCallbackQuery();
})

composer.callbackQuery(/^(project|cashbox)_setting_(\d+)$/, async(ctx) => {
    ctx.scenes.enter('editSetting');
    ctx.answerCallbackQuery();
})

composer.callbackQuery(/^member_invite$/, async(ctx) => {
    ctx.scenes.enter('inviteMember');
    ctx.answerCallbackQuery();
})

composer.callbackQuery(/^back$/, async(ctx) => {
    const history = new HistoryService(ctx);
    let backstep: any = history.getPreviosStep();

    try{
        await render(ctx, backstep)
    }catch(err){
        await render(ctx, {type: 'start'})
    }
    await ctx.answerCallbackQuery();
})

export default composer;
