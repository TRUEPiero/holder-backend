import { InlineKeyboard } from "grammy";
import { CommonKeyboard } from "./common";

export class MenuKeyboard {
    static mainMenu() {
        return new InlineKeyboard()
            .text('Список проектов','project_page_1')
            .row()
            .text('Настройки', 'user_settings')
    }

    static projectMenu() {
        return new InlineKeyboard()
            .text('Список счетов', 'cashbox_page_1')
            .text('Настройки', `project_settings`)
            .row()
            .text('Удалить', `project_delete`)
            .append(CommonKeyboard.back())
    }

    static cashboxMenu() {
        return new InlineKeyboard()
            .text('Пополнить', 'cashbox_transaction_income')
            .text('Переверсти', 'cashbox_transaction_expense')
            .row()
            .text('История операций', 'transaction_page_1')
            .text('Настройки', `cashbox_settings`)
            .row()
            .text('Удалить', `cashbox_delete`)
            .append(CommonKeyboard.back())
    }

    static transactionMenu() {
        return new InlineKeyboard()
            .text('Повторить', 'transaction_repeat')
            .text('Отменить', 'transaction_delete')
            .row()
            .append(CommonKeyboard.back())
    }

    static memberMenu() {
        return new InlineKeyboard()
            .text('Сменить роль', 'member_set_role')
            .text('Удалить', 'member_delete')
            .append(CommonKeyboard.back())
    }

    static memberInvite() {
        return new InlineKeyboard()
            .text('Пригласить пользователя', 'member_invite')
            .row()
    }
}
