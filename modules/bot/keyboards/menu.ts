import { InlineKeyboard } from "grammy";
import { CommonKeyboard } from "./common";

export class MenuKeyboard {
    static mainMenu() {
        return new InlineKeyboard()
            .text('Список проектов','project_page_1')
            .text('Добавить проект', 'project_create')
            .row()
    }

    static projectMenu(id: number) {
        return new InlineKeyboard()
            .text('Список счетов', 'cashbox_page_1')
            .text('Добавить счет', 'cashbox_create')
            .row()
            .text('Настройки', `project_settings_${id}`)
            .row()
            .append(CommonKeyboard.back())
    }

    static cashboxMenu(id: number) {
        return new InlineKeyboard()
            .text('Список операций', 'transaction_page_1')
            .text('Перевод', 'transfer')
            .row()
            .text('Настройки', `cashbox_settings_${id}`)
            .row()
            .append(CommonKeyboard.back())
    }

    static transactionMenu() {
        return new InlineKeyboard()
            .text('Повторить', 'transaction_repeat')
            .row()
            .append(CommonKeyboard.back())
    }
}
