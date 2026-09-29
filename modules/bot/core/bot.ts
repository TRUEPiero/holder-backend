import {Bot, session} from 'grammy';
import { BotService } from '../services/bot.service';
import { errorHandler } from './error-handler';
import { BotContext } from './context';
import { setupHandlers } from '../handlers';
import { scenes } from '../scenes/scenes';
import { Step } from '../types';
// import { i18n } from './i18n';

export async function startBot() {
    const token = process.env.BOT_TOKEN;

    if (!token) {
    throw new Error('BOT_TOKEN is not defined');
    }

    const bot = new Bot<BotContext>(token);

    bot.use(session({
        initial: () => ({
            history: [] as Step[],
        })
    }))
    bot.use(scenes.manager());
    bot.use(scenes);

    // bot.use(i18n);

    bot.catch(errorHandler);
    setupHandlers(bot);

    BotService.init(bot);

    bot.start();
}