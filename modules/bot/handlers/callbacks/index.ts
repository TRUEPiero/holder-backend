import { Composer } from "grammy";
import { BotContext } from "../../core/context";

const composer = new Composer<BotContext>();

composer.callbackQuery('project_list', async (ctx) => {
    await ctx.reply('Список проектов:')
})

export default composer;