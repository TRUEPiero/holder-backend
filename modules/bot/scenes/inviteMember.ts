import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { render } from "../lib/render";
import { CommonKeyboard } from "../keyboards/common";
import { EntityServiceFactory } from "../lib/entity-factory";
import { Step } from "../types";

const scene = new Scene<BotContext>('inviteMember');

scene.step(async(ctx) => {
    ctx.session.entityData = {
        entity: 'member'
    }
})

scene.label('enter_username').step(async(ctx) => {
    await ctx.editMessageText(`Введите ник пользователя, например: <b>@holder_manage_bot</b>`, {
        reply_markup: CommonKeyboard.cancelCreate(),
        parse_mode: 'HTML'
    })
})

scene.wait('wait_username').on(['message:text', 'callback_query'], async(ctx) => {
    const choice = ctx.callbackQuery?.data;
    if(choice && choice === 'create_cancel') {
        ctx.answerCallbackQuery();
        await render(ctx, {
            type: 'page',
            entity: 'member',
            id: 1
        });
        ctx.scene.exit();
        return;
    }

    const username = ctx.message?.text;
    if(!username) {
        scene.goto('enter_username')
    }  
    
    ctx.session.entityData.username = username;
    ctx.scene.resume();
})

scene.label('add_member').step(async(ctx) => {
    const createData = ctx.session.entityData;
    const service = EntityServiceFactory.create(createData.entity);

    try{     
        const item = await service.create(ctx)
        if(!item) throw new Error("MEMBER_NOT_CREATED");

        const step: Step = {
            entity: createData.entity,
            type: 'item',
            id: item.id
        }
        
        await render(ctx, step, true);
    }catch(err: any){
        const username = ctx.session.entityData.username;
        console.log(err)

        if(err.message === 'USER_NOT_FOUND') {
            await ctx.reply(`Пользователь с ником ${username} не зарегистрирован в системе`);
            return;
        }
        await ctx.reply('Ошибка при создании. Обратитесь в сл. под.');
    }

    ctx.scene.exit();
})

export default scene;