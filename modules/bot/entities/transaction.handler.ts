import { container } from "../../containers";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { SettingKeyboard } from "../keyboards/settings";
import { BaseEntityHandler } from "./base-entity.handler";
import { formatDate } from "../lib/formatter";
import { EntityListOptions, TransactionTypes } from "../types";
import { Transaction } from "../../project/src/modules/transaction/types";
import { DecimalClass as Decimal } from "@shared-types/index.ts";

type CreateData = {
    amount: number,
    type: TransactionTypes,
    itemId?: number,
    description: string,
    requisites?: string  
}

export class TransactionHandler extends BaseEntityHandler<any> {
    protected service = container.transactionService;
    protected settingService = undefined;
    private userService = container.userService;
    private transferService = container.transferService;

    constructor(protected ctx: BotContext) {
        super()
    }

    public getFilter() {
        return { cashboxId: this.ctx.session.cashbox_id };
    }



    public async create() {
        const createData = this.ctx.session.entityData;
        
        const data = {
            amount: createData.amount,
            type: createData.type
        }

        return await this.service.create(data)
    }

    public async update() {

    }

    public async delete() {
        const user = await this.userService.getUser(this.ctx.session.user_id);

        return await this.service.delete(
            this.ctx.session.project_id,
            this.getId(),
            user
        );
    }
    
    public async moneyTransfer() {
        const createData: CreateData = this.ctx.session.entityData;

        const user = await this.userService.getUser(this.ctx.session.user_id);
        const projectId = this.ctx.session.project_id;
        const [current, linked] = this.getCorrectCashboxes(createData);

        const request = {
            to: linked!,
            type: createData.type,
            amount: createData.amount,
        }
        const method = createData.itemId 
            ? this.transferService.transferMoneyBetweenCashbox.bind(this.transferService)
            : this.transferService.transferWithExternal.bind(this.transferService)

        return await method(projectId, current!, request, user);
    }

    protected getId() {
        return this.ctx.session.transaction_id;
    }

    protected getFields() {
        return [
            { key: "type", title: "Тип", visible: true, formatter: (value: string) => value === 'income' ? 'Приход' : 'Расход' },
            { key: "author", title: "Автор", visible: false },
            { key: "createdAt", title: "Дата", visible: true, formatter: (value: Date) => formatDate(value)},
            { key: "amount", title: "Сумма", visible: true, formatter: (value: number | string) => new Decimal(value).toFixed(2)  },
            { key: "description", title: "Подпись", visible: true },
        ];
    }

    protected async renderList(page: number) {

        const options: EntityListOptions = {
            limit: 5, 
            page
        }

        return ItemsKeyboard.entityList("transaction", this.service, this.getFilter(), this.getTitleKey, options);
    }

    protected async renderItem() {
        return MenuKeyboard.transactionMenu();
    }

    protected async renderSettings() {
        return await SettingKeyboard.transactionSetting();
    }

    private getCorrectCashboxes(data: CreateData) {
        const type = data.type;
        const cashboxId = this.ctx.session.cashbox_id;

        if(type === 'income') {
            if(data.itemId) {
                return [data.itemId, cashboxId];
            }

            return [cashboxId, undefined]
        }

        return [cashboxId, data.itemId];
    }

    private getTitleKey(item: Transaction) {
        const type = item.type === 'income' ? '+' : '-'

        const dateString = formatDate(item.createdAt);
        const amount = new Decimal(item.amount!).toFixed(2);

        return `${dateString} ${type}${amount}`;
    }
}