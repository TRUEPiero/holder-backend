import {Bot} from 'grammy';

const bot = new Bot(process.env.BOT_TOKEN);

export async function startBot() {
    bot.start();
}