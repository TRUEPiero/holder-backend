import { InlineKeyboard } from "grammy";
import { Scene } from "grammy-scenes";
import { BotContext } from "../core/context";
import { CommonKeyboard } from "../keyboards/common";
import { render } from "../lib/render";
import { EntityHandlerFactory } from "../lib/factory";
import { CashboxHandler } from "../entities/cashbox.handler";
import { TransactionHandler } from "../entities/transaction.handler";
import { Step, TransactionTypes } from "../types";

const scene = new Scene<BotContext>('moneyTransfer');

scene.step(async(ctx) => {
    const transactionType = ctx.match![1] as TransactionTypes;

    ctx.session.entityData = {
        type: transactionType
    };

    const keyboard = transactionType === 'income' ? CommonKeyboard.operationIncome() : CommonKeyboard.operationExpense()

    await ctx.editMessageText('OK', {
        reply_markup: keyboard
    })
})

scene.wait('check_operation').on('callback_query', async(ctx) => {
    ctx.answerCallbackQuery();
    const choice = ctx.callbackQuery?.data;
    const exit = await responseToCancel(ctx, choice);
    if(exit) return;

    if(choice === 'internal_cashbox') {
        ctx.scene.goto('choice_cashbox');
    } else {
        ctx.scene.goto('enter_requisites');
    }

    return;
})

scene.label('choice_cashbox').step(async(ctx) => {
    const handler = EntityHandlerFactory.create(ctx, 'cashbox') as CashboxHandler;

    const page = ctx.session.entityData.page || 1;
    const cashboxId = ctx.session.cashbox_id;

    await ctx.editMessageText('Выберите счет', {
        reply_markup: (await handler.renderListForChoice(page, cashboxId))
            .append(CommonKeyboard.cancelCreate())
    })
})

scene.wait('wait_cashbox').on(['callback_query'], async(ctx) => {
    const choice = ctx.callbackQuery?.data;
    const exit = await responseToCancel(ctx, choice);
    if(exit) return;

    const pagination = /^cashbox_page_(\d+)$/;
    const item = /^cashbox_(\d+)$/;

    if(pagination.test(choice!)) {
        const match = choice!.match(pagination);
        const page = match![1];
        ctx.session.entityData.page = Number(page);
        ctx.scene.goto('choice_cashbox')
    } else if(item.test(choice!)) {
        const match = choice!.match(item);
        ctx.session.entityData.itemId = Number(match![1]);
        ctx.scene.goto('enter_description');
    }

    return;
})

scene.label('enter_requisites').step(async(ctx) => {
    await ctx.editMessageText('Введите реквизиты счета (необязательно)', {
        reply_markup: new InlineKeyboard()
            .append(CommonKeyboard.nextStep(), CommonKeyboard.cancelCreate())
    })    
})

scene.wait('wait_requisites').on(['message:text', 'callback_query'], async(ctx) => {
    const choice = ctx.callbackQuery?.data;
    const exit = await responseToCancel(ctx, choice);
    if(exit) return;

    const requisites = ctx.message?.text;

    ctx.session.entityData.requisites = requisites || '';
    ctx.scene.resume();
})

scene.label('enter_description').step(async(ctx) => {
    const text = 'Введите описание (необязательно)';
    const keyboard = new InlineKeyboard()
        .append(CommonKeyboard.nextStep(), CommonKeyboard.cancelCreate())

    if(ctx.callbackQuery) {
        await ctx.editMessageText(text, {reply_markup: keyboard})
        return;
    }

    await ctx.reply(text, {reply_markup: keyboard})
})

scene.wait('wait_description').on(['message:text', 'callback_query'], async(ctx) => {
    const choice = ctx.callbackQuery?.data;
    const exit = await responseToCancel(ctx, choice);
    if(exit) return;
    
    const description = ctx.message?.text;

    ctx.session.entityData.description = description || '';
    ctx.scene.resume();
})

scene.label('enter_amount').step(async(ctx) => {
    const text = 'Введите сумму';
    const keyboard = new InlineKeyboard()
        .append(CommonKeyboard.cancelCreate())

    if(ctx.callbackQuery) {
        await ctx.editMessageText(text, {reply_markup: keyboard})
        return;
    }

    await ctx.reply(text, {reply_markup: keyboard})
})

scene.wait('wait_amount').on(['message:text', 'callback_query'], async(ctx) => {
    const choice = ctx.callbackQuery?.data;
    const exit = await responseToCancel(ctx, choice);
    if(exit) return;
    
    const amount = Number(ctx.message?.text);

    if(!amount) {
        ctx.scene.goto('enter_amount');
    }

    ctx.session.entityData.amount = amount;
    ctx.scene.resume();
})

scene.label('create_transfer').step(async(ctx) => {
    const handler = EntityHandlerFactory.create(ctx, 'transaction') as TransactionHandler;

    try {
        const res = await handler.moneyTransfer();
        if(!res) {
            throw new Error('TRANSACTION_NOT_CREATED')
        }

        const step: Step = {
            entity: 'cashbox',
            type: 'item',
            id: ctx.session.cashbox_id
        }

        await render(ctx, step, true)
    } catch (error) {
        console.log(error);
        await ctx.reply('Ошибка при создании. Обратитесь в сл. под.');
    }
    
    ctx.scene.exit();
})


const responseToCancel = async (ctx: any, choice?: string) => {
    
    if(choice === 'create_cancel') {
        const step: Step = {
            entity: 'cashbox',
            type: 'item',
            id: ctx.session.cashbox_id
        }

        await render(ctx, step);
        ctx.scene.exit();
        return true;
    }
} 

const responseToNextStep = async (ctx: any, step: string, choice?: string) => {
    if(choice === 'next_step') {        
        ctx.scene.resume();
        return;
    }
}  

export default scene;