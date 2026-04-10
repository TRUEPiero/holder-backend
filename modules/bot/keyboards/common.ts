import { InlineKeyboard } from "grammy";

export class CommonKeyboard {
    static back() {
        return new InlineKeyboard().text('Назад','back')
    }
}