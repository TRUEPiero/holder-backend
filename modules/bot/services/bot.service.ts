import {Bot, InputFile} from 'grammy';
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

    async sendMessage(chat_id: number | string, text: string, options?: any) {
        await this.bot.api.sendMessage(chat_id, text, options);
    }

    async editMessage(chat_id: number | string, message_id: number, text: string, options?: any) {
        await this.bot.api.editMessageText(chat_id, message_id, text, options);
    }

    async deleteMessage(chat_id: number | string, message_id: number) {
        await this.bot.api.deleteMessage(chat_id, message_id);
    }

    async sendPhoto(chat_id: number | string, photo: string | InputFile, options?: any) {
        await this.bot.api.sendPhoto(chat_id, photo, options);
    }

    async sendVideo(chat_id: number | string, video: string | InputFile, options?: any) {
        await this.bot.api.sendVideo(chat_id, video, options);
    }

    async getChat(chat_id: number | string) {
        const chat = await this.bot.api.getChat(chat_id);
        return chat;
    }
}