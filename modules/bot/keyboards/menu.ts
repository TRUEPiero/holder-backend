import { InlineKeyboard } from "grammy";

export class MenuKeyboard {
    static mainMenu() {
        return new InlineKeyboard()
            .text('Список проектов','project_list')
    }

    static projectMenu() {
        return new InlineKeyboard()
            .text('Список счетов', 'cashbox_list');
    }

    static cashboxMenu() {
        return new InlineKeyboard()
            .text('что то')
    }
}
