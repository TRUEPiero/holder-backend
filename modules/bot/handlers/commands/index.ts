import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { render } from "../../lib/render";
import { container } from "../../../containers";

const {userService, telegramLinkService} = container;

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    const chatId = ctx.from?.id?.toString();
    if(!chatId) return;

    const username = ctx.from?.username;

    const filter = {
        telegramId: chatId
    }

    let user = await userService.getTelegramUser(filter)

    if(!user) {
        const token = ctx.match.trim();
        if(!token) return await ctx.reply(ctx.t('user-empty'));
        user = await telegramLinkService.consume(token, chatId, username);
    }

    ctx.session.user_id = user.getId();

    const curLocale = ctx.from?.language_code;
    const locale = user.getLocale();

    if( curLocale !== locale) {
        await ctx.i18n.setLocale(locale);
    }

    await render(ctx, {type: 'start'}, true);
})

composer.command('test', async(ctx) => {
    console.log(ctx);
})

export default composer;
