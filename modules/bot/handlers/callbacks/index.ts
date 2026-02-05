import { Composer } from "grammy";
import { BotContext } from "../../core/context";
import { MenuKeyboard } from "../../keyboards/menu";
import { ProjectService } from "../../../project/services/project";

const projectService = new ProjectService();

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
    await ctx.answerCallbackQuery();

    const projectId = Number(ctx.match[1])
    const project = (await projectService.getById(projectId)).data;

    await ctx.editMessageText(`Проект: ${project?.title}`)
})

export default composer;
