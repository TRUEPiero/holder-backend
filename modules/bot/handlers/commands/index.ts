import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { render } from "../../lib/render";
import { container } from "../../../containers";

const {userService, casheService} = container;

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    const chatId = ctx.from?.id;
    if(!chatId) return;

    const hasCashe = await casheService.exists(`tgUser:${chatId}`);
    if(hasCashe) return await render(ctx, {type: 'start'}, true);

    const user = await userService.getTelegramUser(chatId)

    if(!user) {
        await ctx.reply(`К сожалению, нам не удалось найти вас в системе. 
Для использования данного бота зарегистрируйтесь на сайте holder.com`);
    } else {
        ctx.session.user_id = user.id;
        await casheService.set(`tgUser:${chatId}`, user);
        await render(ctx, {type: 'start'}, true);
    }
})

composer.command('test', async(ctx) => {
    console.log(ctx);
})

export default composer;
