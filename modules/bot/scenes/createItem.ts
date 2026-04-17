import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { render } from "../lib/render";
import { EntityHandlerFactory } from "../lib/factory";
import { Step } from "../types";
import { CommonKeyboard } from "../keyboards/common";

const scene = new Scene<BotContext>("createEntity");

scene.step(async (ctx) => {
    const entity = ctx.match![1]
    const handler = EntityHandlerFactory.create(ctx, entity);
    if(!handler) return;

    ctx.session.entityData = {
        entity,
        title: '',
        filter: handler.getFilter()
    };

})

scene.label('enter_title').step(async (ctx) => {
    await ctx.editMessageText(`Введите наименование`, {
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

scene.label('create_item').step(async(ctx) => {

    const createData = ctx.session.entityData;
    const handler = EntityHandlerFactory.create(ctx, createData.entity);

    if(!handler) return;

    try{     
        const item = await handler.create()
        if(!item) throw new Error('ITEM_NOT_CREATED');

        const step: Step = {
            entity: createData.entity,
            type: 'item',
            id: item.id
        }
        
        await render(ctx, step, true);

    }catch(err){
        console.log(err)
        await ctx.reply('Ошибка при создании. Обратитесь в сл. под.');
    }

    ctx.scene.exit();
})

export default scene;