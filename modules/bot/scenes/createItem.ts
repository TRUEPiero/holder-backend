import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { render } from "../lib/render";
import { EntityHandlerFactory } from "../lib/factory";

const scene = new Scene<BotContext>("createEntity");
scene.step(async (ctx) => {
    const entity = ctx.match![1]
    const handler = EntityHandlerFactory.create(ctx, entity);
    if(!handler) return;

    ctx.session.createEntityData = {
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
    
    ctx.session.createEntityData.title = title;
    ctx.scene.goto('create_item');
})

scene.label('create_item').step(async(ctx) => {

    const createData = ctx.session.createEntityData;
    const handler = EntityHandlerFactory.create(ctx, createData.entity);

    if(!handler) return;

    try{
        const user = ctx.session.user_id;
        const data = {
            title: createData.title,
            ...createData.filter
        }
        
        const item = await handler.service.create(user, data)
        await ctx.reply('Успешно!');
    }catch(err){
        console.log(err)
        await ctx.reply('Ошибка при создании. Обратитесь в сл. под.');
    }

    await render(ctx, {type: 'start'}, true);
    ctx.scene.exit();
})

export default scene;