import { BotContext } from "../../core/context";
import { container } from "../../../containers";
import { EntityService } from "../../interfaces/entity.service";
import { MoneyTransfer } from "../../interfaces/money-transfer";
import { TransactionTypes } from "../../types";

type CreateData = {
    amount: number,
    type: TransactionTypes,
    itemId?: number,
    description: string,
    requisites?: string
}

const { transactionService, transferService, userService } = container;

const transactionServiveTg: EntityService<'transaction'> & MoneyTransfer = {
    baseService: transactionService,
    settingService: null,
    userService: userService,
    transferService: transferService,

    async getItem(ctx) {
        const id = ctx.session.transaction_id;

        return this.baseService.getById(id)
    },
    getList(filter) {
        return this.baseService.getWithPagination(filter)
    },
    async create(ctx: BotContext) {

    },
    async update(ctx: BotContext) {

    },
    async delete(ctx: BotContext) {
        const project_id = ctx.session.project_id
        const cashbox_id = ctx.session.project_id;
        const transaction_id = ctx.session.transaction_id;
        const user = await this.userService.getUser(ctx.session.user_id);

        return await transferService.cancelTransaction(transaction_id,user, cashbox_id, project_id);
    },
    async moneyTransfer(ctx) {
        const createData: CreateData = ctx.session.entityData;

        const user = await this.userService.getUser(ctx.session.user_id);
        const projectId = ctx.session.project_id;
        const [current, linked] = this.getCorrectCashboxes(ctx, createData);

        const request = {
            to: linked!,
            type: createData.type,
            amount: createData.amount,
        }
        const method = createData.itemId
            ? this.transferService.transferMoneyBetweenCashbox.bind(this.transferService)
            : this.transferService.transferWithExternal.bind(this.transferService)

        return await method(projectId, current!, request, user);
    },
    getCorrectCashboxes(ctx, data) {
        const type = data.type;
        const cashboxId = ctx.session.cashbox_id;

        if (type === 'income') {
            if (data.itemId) {
                return [data.itemId, cashboxId];
            }

            return [cashboxId, undefined]
        }

        return [cashboxId, data.itemId];
    },
}

export {
    transactionServiveTg
}