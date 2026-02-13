import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { UserService } from "../../../auth/services/user";

const userService = new UserService;

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    // const match = ctx.match;

    // if(match.trim() && match.startsWith('link_')) {
    //     const user_id = Number(match.replace('link_', ''))
    //     await userService.updateItem(user_id, {
    //         telegramId: ctx.chat.id
    //     })
    //     ctx.session.user_id = user_id;
    // } 

    const username = ctx.chat.username;

    if(ctx.session.user_id) {
        await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()});
        return
    }

    const user = (await userService.getFirstByFields({telegram: username})).data

    if(!user) {
        await ctx.reply(`К сожалению, нам не удалось найти вас в системе. 
Для использования данного бота зарегистрируйтесь на сайте holder.com`, {reply_markup: MenuKeyboard.registration()});
    } else {
        ctx.session.user_id = user.id;
        await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()});
    }
})

export default composer;
