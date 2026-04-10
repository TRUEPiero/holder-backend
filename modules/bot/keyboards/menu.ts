import { InlineKeyboard } from "grammy";
import { CommonKeyboard } from "./common";

export class MenuKeyboard {
    static mainMenu() {
        return new InlineKeyboard()
            .text('Список проектов','project_page_1')
            .text('Добавить проект', 'project_create')
            .row()
    }

    static projectMenu() {
        return new InlineKeyboard()
            .text('Список счетов', 'cashbox_page_1')
            .text('Добавить проект', 'cashbox_create')
            .row()
            .text('Настройки', 'project_settings')
            .row()
            .append(CommonKeyboard.back())
    }

    static cashboxMenu() {
        return new InlineKeyboard()
            .text('Настройки')
            .row()
            .append(CommonKeyboard.back())
    }
}
