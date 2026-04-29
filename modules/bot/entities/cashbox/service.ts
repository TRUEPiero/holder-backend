import { container } from "../../../containers";
import { BotContext } from "../../core/context";
import { EntityService } from "../../interfaces/entity.service";

const {cashboxService, userService, cashboxSettingService} = container

const cashboxServiceTg: EntityService<'cashbox'> = {
    baseService: cashboxService,
    settingService: cashboxSettingService,
    userService: userService,

    async getItem(ctx) {
        const id = ctx.session.cashbox_id;
        const project_id = ctx.session.project_id;
        const user = await this.userService.getUser(ctx.session.user_id);

        return this.baseService.getById(id, user, project_id)
    },
    getList(filter) {
        return this.baseService.getWithPagination(filter)
    },
    async getSettings(ctx) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const id = ctx.session.cashbox_id;

        return this.settingService!.getForTelegram(id, user);
    },
    async create(ctx: BotContext) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const createData = ctx.session.entityData;
        const data = {
            title: createData.title
        }

        return await this.baseService.create(ctx.session.project_id, data, user);
    },
    async update(ctx: BotContext){
        const projectId = ctx.session.project_id;
        const cashboxId = ctx.session.cashbox_id;
        const user = await this.userService.getUser(ctx.session.user_id);
        const updateData = ctx.session.entityData;
        const data = {
            title: updateData.title
        }

        return await this.baseService.update(projectId, cashboxId, data, user);
    },
    async delete(ctx: BotContext){
        const projectId = ctx.session.project_id;
        const cashboxId = ctx.session.cashbox_id;
        const user = await this.userService.getUser(ctx.session.user_id);

        return await this.baseService.delete(projectId, cashboxId, user);
    },
}

export {
    cashboxServiceTg
}