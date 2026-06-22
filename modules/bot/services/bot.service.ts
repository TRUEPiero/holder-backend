import {Bot} from 'grammy';
import { BotContext } from '../core/context';

export class BotService {
    private static instance: BotService;
    private bot: Bot<BotContext>;

    private constructor(bot: Bot<BotContext>) {
        this.bot = bot
    }

    static init(bot: Bot<BotContext>) {
        BotService.instance = new BotService(bot);
    } 

    static getInstance() {
        if (!BotService.instance) {
            throw new Error('BotService not initialized. Call BotService.init() first.');
        }
        return BotService.instance;
    }

    async sendMessage(chat_id: number, text: string, options?: any) {
        await this.bot.api.sendMessage(chat_id, text, options);
    }

    async getChat(chat_id: number) {
        const chat = await this.bot.api.getChat(chat_id);
        return chat;
    }
}