import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { render } from "../lib/render";
import { EntityHandlerFactory } from "../lib/factory";
import { Step } from "../types";
import { ProjectEntity } from "../../project/src/modules/project/entities/Project";

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
    await ctx.reply(`Введите наименование
Для отмены введите <code>/cancel</code>`, 
        {
            parse_mode: 'HTML'
        }
    )
})

scene.wait('wait_title').on('message:text', async(ctx) => {
    const title = ctx.message.text.trim();
    if(!title) {
        scene.goto('enter_title')
    }  
    
    if(title === '/cancel') {
        await render(ctx, {type: 'start'}, true);
        ctx.scene.exit();
    }
    
    ctx.session.entityData.title = title;
    ctx.scene.goto('create_item');
})

scene.label('create_item').step(async(ctx) => {

    const createData = ctx.session.entityData;
    const handler = EntityHandlerFactory.create(ctx, createData.entity);

    if(!handler) return;

    try{     
        const item = await handler.create()
        if(!item) return;

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