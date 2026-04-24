import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { render } from "../../lib/render";
import { container } from "../../../containers";

const service = container.userService;

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    const username = ctx.chat.username;

    if(ctx.session.user_id) {
        await render(ctx, {type: 'start'}, true)
        return;
    }

    const user = (await service.getTelegramUser(username!))

    if(!user) {
        await ctx.reply(`К сожалению, нам не удалось найти вас в системе. 
Для использования данного бота зарегистрируйтесь на сайте holder.com`);
    } else {
        ctx.session.user_id = user.id;
        await render(ctx, {type: 'start'}, true)
    }
})

composer.command('test', async(ctx) => {
    console.log(ctx);
})

export default composer;
