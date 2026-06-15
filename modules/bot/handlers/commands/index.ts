import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { render } from "../../lib/render";
import { container } from "../../../containers";

const {userService, casheService} = container;

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    const chatId = ctx.from?.id;
    if(!chatId) return;

    const username = ctx.from?.username;

    const hasCashe = await casheService.exists(`tgUser:${chatId}`);
    if(hasCashe) return await render(ctx, {type: 'start'}, true);

    const filter = {
        telegramId: chatId.toString()
    }

    let user = await userService.getTelegramUser(filter)

    if(!user) {
        const userId = ctx.match;
        if(!userId) return await ctx.reply(`К сожалению, нам не удалось найти вас в системе. 
Для использования данного бота зарегистрируйтесь на сайте holder.com`);

        const finded = await userService.getUser(Number(userId));
        if(!finded) {
            await ctx.reply('Ошибка. Обратитесь в сл. под.')
            return;
        };

        const updateData = {
            telegramId: chatId,
            telegram: username,
        };

        user = await userService.update(finded, updateData);
    }

    ctx.session.user_id = user.id;
    await casheService.set(`tgUser:${chatId}`, user);
    await render(ctx, {type: 'start'}, true);
})

composer.command('test', async(ctx) => {
    console.log(ctx);
})

export default composer;
