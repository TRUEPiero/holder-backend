import { InlineKeyboard } from "grammy";

export class CommonKeyboard {
    static back() {
        return new InlineKeyboard().text('Назад','back')
    }

    static nextStep() {
        return new InlineKeyboard()
            .text('Далее', 'next_step')
            .row()
    }

    static confirmDelete() {
        return new InlineKeyboard()
            .text('Удалить', 'del_confirm')
            .text('Отемна', 'cancel')
    }

    static create(entity: string) {
        return new InlineKeyboard()
            .text('Добавить', `${entity}_create`)
            .row()
    }

    static cancelCreate() {
        return new InlineKeyboard()
            .text('Отемна', 'create_cancel')
            .row()
    }

    static operationIncome() {
        return new InlineKeyboard()
            .text('С моего счета', 'internal_cashbox')
            .text('Др. пополнение', 'external_cashbox')
            .row()
            .append(this.cancelCreate())
    }

    static operationExpense() {
        return new InlineKeyboard()
            .text('Между счетами', 'internal_cashbox')
            .text('Др. расходы', 'external_cashbox')
            .row()
            .append(this.cancelCreate())
    }

}