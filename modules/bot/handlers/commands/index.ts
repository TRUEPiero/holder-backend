import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    console.log(ctx.session)
    await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()})
})

export default composer;
