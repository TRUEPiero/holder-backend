import { formatDate } from "../../lib/formatter";
import { EntityConfig } from "../../interfaces/entity.config";
import { DecimalClass as Decimal } from "@shared-types/index";

const transactionConfig: EntityConfig<any> = {
    fields: [
        { key: "type", title: "Тип", visible: true, formatter: (value: string) => value === 'income' ? 'Приход' : 'Расход' },
        { key: "author", title: "Автор", visible: false },
        { key: "createdAt", title: "Дата", visible: true, formatter: (value: Date) => formatDate(value)},
        { key: "amount", title: "Сумма", visible: true, formatter: (value: number | string) => new Decimal(value).toFixed(2)  },
        { key: "description", title: "Подпись", visible: true },
    ],
    
    getTitleKey(item) {
        const type = item.getType() === 'income' ? '+' : '-'

        const dateString = formatDate(item.getCreatedAt());
        const amount = new Decimal(item.getAmount()!).toFixed(2);

        return `${dateString} ${type}${amount}`;
    },
    getId(ctx) {
        return ctx.session.transaction_id
    },
    getFilter(ctx) {
      return { cashboxId: ctx.session.cashbox_id};  
    },
}

export {
    transactionConfig
}