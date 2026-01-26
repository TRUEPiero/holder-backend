import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    await ctx.reply('Начало', {reply_markup: await MenuKeyboard.mainMenu()})
})

export default composer;