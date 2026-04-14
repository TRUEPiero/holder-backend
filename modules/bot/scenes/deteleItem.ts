import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { EntityHandlerFactory } from "../lib/factory";
import { InlineKeyboard } from "grammy";
import { render } from "../lib/render";
import { Step } from "../types";

const scene = new Scene<BotContext>("deleteEntity");

const keyboard = new InlineKeyboard()
    .text('Удалить', 'del_yes')
    .text('Отемна', 'cancel')

scene.label('confirm_delete').step(async(ctx) => {
    const entity = ctx.match![1];
    const handler = EntityHandlerFactory.create(ctx, entity);
    if(!handler) return;

    ctx.session.entityData = {entity}

    await ctx.editMessageText(`Вы уверены, что хотите удалить?`, {
        reply_markup: keyboard
    })
})

scene.wait('choice').on('callback_query', async(ctx) => {
    await ctx.answerCallbackQuery()
    const choice = ctx.callbackQuery.data;
    if(choice === 'cancel') {
        await render(ctx, {type: 'start'}, true);
        ctx.scene.exit();
        return;
    }
    ctx.scene.resume();
})

scene.label('delete_project').step(async(ctx) => {
    console.log('test')
    const createData = ctx.session.entityData;
    const handler = EntityHandlerFactory.create(ctx, createData.entity);

    if(!handler) return;

    try{
        await handler.delete();
        
        const step: Step = {
            entity: createData.entity,
            type: 'page',
            id: 1
        }
        
        await render(ctx, step);
    }catch(err){
        console.log(err)
        await ctx.reply('Ошибка при удалении. Обратитесь в сл. под.');
    }
    
    ctx.scene.exit();
})

export default scene;