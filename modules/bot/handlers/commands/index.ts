import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { UserService } from "../../../auth/src/modules/user/services";

const userService = new UserService;

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    const username = ctx.chat.username;

    if(ctx.session.user_id) {
        await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()});
        return
    }

    const user = (await userService.getFirstByFields({telegram: username})).data

    if(!user) {
        await ctx.reply(`К сожалению, нам не удалось найти вас в системе. 
Для использования данного бота зарегистрируйтесь на сайте holder.com`);
    } else {
        ctx.session.user_id = user.id;
        await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()});
    }
})

export default composer;
