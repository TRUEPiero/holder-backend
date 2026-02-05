import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { UserService } from "../../../auth/services/user";

const userService = new UserService;

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    const chat_id = ctx.chatId;
    const username = ctx.chat.username;

    const user = (await userService.getByFields({
        telegram: username
    })).data

    if(!user) {
        await ctx.reply('Зарегистрироваться');
    }

    await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()})
})

export default composer;
