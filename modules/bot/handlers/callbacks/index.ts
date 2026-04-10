import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { ItemsKeyboard } from "../../keyboards/list";
import { ProjectService } from "../../../project/src/modules/project/services";
import { CashboxService } from "../../../project/src/modules/cashbox/services";
import { DirectoryService } from "@shared/DirectoryService";
import { ProjectRepository } from "../../../project/src/modules/project/repository";
import { CashboxRepository } from "../../../project/src/modules/cashbox/repository";

const composer = new Composer<BotContext>();

const projectBase = new DirectoryService<'project'>('project', ['cashbox']);
const projectRepo = new ProjectRepository(projectBase);
const projectService = new ProjectService(projectRepo);

const cashboxBase = new DirectoryService<'cashbox'>('cashbox', [])
const cashboxRepo = new CashboxRepository(cashboxBase);
const cashboxService = new CashboxService(cashboxRepo);

type EntityHandler = {
    service: any,
    filterKey: string,
    menu: {
        list: (entity: string, filter: any, limit?: number, page?: number) => Promise<any>,
        item: (item?: any) => any
    }
}

const handlers: Record<string, EntityHandler> = {
    project: {
        service: projectService,
        filterKey: 'ownerId',
        menu: {
            list: (entity, filter, limit=5, page=1) => ItemsKeyboard.entityList(entity, filter, limit, page),
            item: (project) => MenuKeyboard.projectMenu()
        }
    },
    cashbox: {
        service: cashboxService,
        filterKey: 'projectId',
        menu: {
            list: (entity, filter, limit=5, page=1) => ItemsKeyboard.entityList(entity, filter, limit, page),
            item: (cashbox) => MenuKeyboard.cashboxMenu()
        }
    }
}

composer.callbackQuery(/^(project|cashbox)_list$/, async (ctx) => {
    const entity = ctx.match[1]
    const handler = handlers[entity];

    await ctx.answerCallbackQuery()
    await ctx.editMessageText('Список:', {reply_markup: await handler.menu.list(entity, {[handler.filterKey]: ctx.session.user_id})})
})

composer.callbackQuery(/^(project|cashbox)_(\d+)$/, async(ctx) => {
    const entity = ctx.match[1];
    const id = Number(ctx.match[2]);
    const handler = handlers[entity];

    const item = (await handler.service.getById(id));
    ctx.session[`${entity}_id`] = id;

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`Сущность: ${item.title}`, {reply_markup: await handler.menu.item()})
})

composer.callbackQuery(/^(project|cashbox)_page_(\d+)$/, async(ctx) => {
    const entity = ctx.match[1]
    const page = Number(ctx.match[2]);
    const handler = handlers[entity];

    await ctx.answerCallbackQuery()
    await ctx.editMessageText('Список:', {reply_markup: await handler.menu.list(ctx, {[handler.filterKey]: ctx.session.user_id}, 5, page)})
})

export default composer;
