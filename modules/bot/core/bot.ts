import {Bot, session} from 'grammy';
import { BotService } from '../services/bot.service';
import { errorHandler } from './error-handler';
import { BotContext } from './context';
import { setupHandlers } from '../handlers';
import { scenes } from '../scenes/scenes';

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error('BOT_TOKEN is not defined');
}

const bot = new Bot<BotContext>(token);

bot.use(session({
    initial: () => ({
        history: []
    })
}))
bot.use(scenes.manager());
bot.use(scenes);

bot.catch(errorHandler);
setupHandlers(bot);

BotService.init(bot);

export async function startBot() {
    bot.start();
}