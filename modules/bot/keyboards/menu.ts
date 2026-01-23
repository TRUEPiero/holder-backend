import { Keyboard, InlineKeyboard } from "grammy";

export class MenuKeyboard {
    static mainMenu() {
        return new InlineKeyboard()
            .text('Мои проекты', 'project_list')
    }
}