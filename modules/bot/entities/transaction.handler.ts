import { container } from "../../containers";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { BaseEntityHandler } from "./base-entity.handler";

export class TransactionHandler extends BaseEntityHandler<any> {
    service = container.transactionService;

    constructor(protected ctx: BotContext) {
        super()
    }

    public getFilter() {
        return { cashboxId: this.ctx.session.cashbox_id };
    }

    protected getFields() {
        return [
            { key: "type", title: "Тип", visible: true },
            { key: "author", title: "Автор", visible: false },
            { key: "createdAt", title: "Дата", visible: true },
            { key: "amount", title: "Сумма", visible: true },
            { key: "description", title: "Подпись", visible: true },
        ];
    }

    protected async renderList(page: number) {
        return ItemsKeyboard.entityList("transaction", this.getFilter(), 5, page);
    }

    protected async renderItem() {
        return MenuKeyboard.transactionMenu();
    }
}