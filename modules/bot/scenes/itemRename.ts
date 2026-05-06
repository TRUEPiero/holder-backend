import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { EntityServiceFactory } from "../lib/entity-factory";
import { CommonKeyboard } from "../keyboards/common";
import { EntityType, Step } from "../types";
import { render } from "../lib/render";

const scene = new Scene<BotContext>('renameEntity')

scene.step(async(ctx) => {
    const entity = ctx.match![1] as EntityType | undefined;

    ctx.session.entityData = {
        entity,
        title: '',
    };

})

scene.label('enter_title').step(async (ctx) => {
    await ctx.editMessageText(`Введите новое наименование`, {
        reply_markup: CommonKeyboard.cancelCreate()
    })
})

scene.wait('wait_title').on(['message:text', 'callback_query'], async(ctx) => {
    const choice = ctx.callbackQuery?.data;
    if(choice && choice === 'create_cancel') {
        ctx.answerCallbackQuery();
        await render(ctx, {type: 'start'});
        ctx.scene.exit();
        return;
    }

    const title = ctx.message?.text;
    if(!title) {
        scene.goto('enter_title')
    }  
    
    ctx.session.entityData.title = title;
    ctx.scene.resume();
})

scene.label('rename_item').step(async(ctx) => {

    const updateData = ctx.session.entityData;
    const service = EntityServiceFactory.create(updateData.entity);

    try{     
        const item = await service.update(ctx)
        if(!item) throw new Error("ITEM_NOT_UPDATED");

        const step: Step = {
            entity: updateData.entity,
            type: 'item',
            id: item.id
        }
        
        await render(ctx, step, true);

    }catch(err){
        console.log(err)
        await ctx.reply('Ошибка при обновлении. Обратитесь в сл. под.');
    }

    ctx.scene.exit();
})

export default scene;