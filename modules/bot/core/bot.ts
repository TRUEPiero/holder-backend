import {Bot} from 'grammy';
import { BotService } from '../services/bot.service';
import { errorHandler } from './error-handler';
import { BotContext } from './context';
import { setupHandlers } from '../handlers';

const bot = new Bot<BotContext>(process.env.BOT_TOKEN);

BotService.init(bot);

setupHandlers(bot);

bot.catch(errorHandler)

export async function startBot() {
    bot.start();
}