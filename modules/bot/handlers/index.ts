import { Bot } from "grammy";
import { BotContext } from "../core/context";
import callbacks from './callbacks'
import commands from './commands'


export function setupHandlers(bot: Bot<BotContext>) {
    bot.use(callbacks);
    bot.use(commands);
}