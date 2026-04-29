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

const {transactionService, transferService, userService} = container;

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
    async getSettings(ctx) {
        return [];
    },
    async create(ctx: BotContext) {
        const project_id = ctx.session.project_id;
        const cashbox_id = ctx.session.project_id;
        const user = await userService.getUser(ctx.session.user_id);

        const createData = ctx.session.entityData;
        
        const data = {
            amount: createData.amount,
            type: createData.type
        }

        return await this.baseService.create(project_id, cashbox_id, data, user)
    },
    async update(ctx: BotContext){

    },
    async delete(ctx: BotContext){
        const user = await this.userService.getUser(ctx.session.user_id);

        return await this.baseService.delete(
            ctx.session.project_id,
            ctx.session.transaction_id,
            user
        );
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

        if(type === 'income') {
            if(data.itemId) {
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