import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { EntityServiceFactory } from "../lib/factory";
import { render } from "../lib/render";
import { EntityType, Step } from "../types";
import { CommonKeyboard } from "../keyboards/common";

const scene = new Scene<BotContext>("deleteEntity");


scene.label('confirm_delete').step(async(ctx) => {
    const entity = ctx.match![1] as EntityType;

    ctx.session.entityData = {
        entity
    }

    await ctx.editMessageText(`Вы уверены, что хотите удалить?`, {
        reply_markup: CommonKeyboard.confirmDelete()
    })
})

scene.wait('choice').on('callback_query', async(ctx) => {
    await ctx.answerCallbackQuery()
    const choice = ctx.callbackQuery.data;
    if(choice === 'create_cancel') {
        await render(ctx, {type: 'start'});
        ctx.scene.exit();
        return;
    }
    ctx.scene.resume();
})

scene.label('delete_project').step(async(ctx) => {
    const createData = ctx.session.entityData;
    const service = EntityServiceFactory.create(createData.entity);

    try{
        await service.delete(ctx);
        
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