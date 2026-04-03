import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { ItemsKeyboard } from "../../keyboards/list";
import { ProjectService } from "../../../project/services/project";
import { CashboxService } from "../../../project/services/cashbox";

const composer = new Composer<BotContext>();

const projectService = new ProjectService();
const cashboxService = new CashboxService();

type EntityHandler = {
    service: { getById: (id: number) => Promise<any> },
    filterKey: string,
    menu: {
        list: (ctx: BotContext, filter: any, limit?: number, page?: number) => Promise<any>,
        item: (item?: any) => any
    }
}

const handlers: Record<string, EntityHandler> = {
    project: {
        service: projectService,
        filterKey: 'user_id',
        menu: {
            list: (ctx, filter, limit=5, page=1) => ItemsKeyboard.entityList('project', filter, limit, page),
            item: (project) => MenuKeyboard.projectMenu()
        }
    },
    cashbox: {
        service: cashboxService,
        filterKey: 'project_id',
        menu: {
            list: (ctx, filter, limit=5, page=1) => ItemsKeyboard.entityList('cashbox', filter, limit, page),
            item: (cashbox) => MenuKeyboard.cashboxMenu()
        }
    }
}

const entityKeys = Object.keys(handlers).join('|');

const listReg = new RegExp(`/^${entityKeys}_list$/`);
const menuReg = new RegExp(`/^${entityKeys}_(\d+)$/`);
const pageReg = new RegExp(`/^${entityKeys}_page_(\d+)$/`);

composer.callbackQuery(listReg, async (ctx) => {
    const entity = ctx.match[1]
    const handler = handlers[entity];

    await ctx.answerCallbackQuery()
    await ctx.editMessageText('Список:', {reply_markup: await handler.menu.list(entity, {[handler.filterKey]: ctx.session.user_id})})
})

composer.callbackQuery(menuReg, async(ctx) => {
    const entity = ctx.match[1];
    const id = Number(ctx.match[2]);
    const handler = handlers[entity];

    const item = (await handler.service.getById(id)).data;
    ctx.session[`${entity}_id`] = id;

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`Сущность: ${item.title}`, {reply_markup: await handler.menu.item()})
})

composer.callbackQuery(pageReg, async(ctx) => {
    const entity = ctx.match[1]
    const page = Number(ctx.match[2]);
    const handler = handlers[entity];

    await ctx.answerCallbackQuery()
    await ctx.editMessageText('Список:', {reply_markup: await handler.menu.list(entity, {[handler.filterKey]: ctx.session.user_id}, 5, page)})
})

export default composer;
