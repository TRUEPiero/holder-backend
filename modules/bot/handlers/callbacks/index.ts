import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { ProjectService } from "../../../project/services/project";
import { CashboxService } from "../../../project/services/cashbox";

const projectService = new ProjectService();
const cashboxService = new CashboxService();

const composer = new Composer<BotContext>();

composer.callbackQuery('project_list', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.editMessageText('Список проектов:', {reply_markup: await MenuKeyboard.projectList(ctx.session.user_id)})
})

composer.callbackQuery('cashbox_list', async(ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText('Список счетов', {reply_markup: await MenuKeyboard.cashboxList(ctx.session.project_id)})
})

composer.callbackQuery(/^project_(\d+)$/, async(ctx) => {
    const projectId = Number(ctx.match[1])
    const project = (await projectService.getById(projectId)).data;
    ctx.session.project_id = projectId;

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`Проект: ${project?.title}`, {reply_markup: await MenuKeyboard.cashboxList(project.id)})
})

composer.callbackQuery(/^cashbox_(\d+)$/, async(ctx) => {
    const cashboxId = Number(ctx.match[1]);
    const cashbox = (await cashboxService.getById(cashboxId)).data;

    ctx.session.project_id = cashboxId;
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`Счет: ${cashbox.title}`)
})

export default composer;
