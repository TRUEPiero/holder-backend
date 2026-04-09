import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { DirectoryService } from "@shared/DirectoryService";
import { UserRepository } from "../../../auth/src/modules/user/repository";

const base = new DirectoryService<'user'>('user', [])
const repo = new UserRepository(base);

const composer = new Composer<BotContext>();

composer.command('start', async (ctx) => {
    const username = ctx.chat.username;

    if(ctx.session.user_id) {
        await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()});
        return
    }

    const user = (await repo.findByTelegram(username!))

    if(!user) {
        await ctx.reply(`К сожалению, нам не удалось найти вас в системе. 
Для использования данного бота зарегистрируйтесь на сайте holder.com`);
    } else {
        ctx.session.user_id = user.id;
        await ctx.reply('Начало', {reply_markup: MenuKeyboard.mainMenu()});
    }
})

export default composer;
