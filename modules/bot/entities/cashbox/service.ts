import { container } from "../../../containers";
import { EntityService } from "../../interfaces/entity.service";
import { EntitySettingsOwner } from "../../interfaces/owner-settings";

const { cashboxService, userService, cashboxSettingService } = container

const cashboxServiceTg: EntityService<'cashbox'> & EntitySettingsOwner = {
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

    async create(ctx) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const createData = ctx.session.entityData;
        const data = {
            title: createData.title
        }

        return await this.baseService.create(user, data, ctx.session.project_id,);
    },
    async update(ctx) {
        const projectId = ctx.session.project_id;
        const cashboxId = ctx.session.cashbox_id;
        const user = await this.userService.getUser(ctx.session.user_id);
        const updateData = ctx.session.entityData;
        const data = {
            title: updateData.title
        }

        return await this.baseService.update(cashboxId, user, data, projectId);
    },
    async delete(ctx) {
        const projectId = ctx.session.project_id;
        const cashboxId = ctx.session.cashbox_id;
        const user = await this.userService.getUser(ctx.session.user_id);

        return await this.baseService.delete(cashboxId, user, projectId);
    },

    async getSetting(ctx, settingId) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const cashbox_id = ctx.session.cashbox_id;
        const project_id = ctx.session.project_id;

        return this.settingService.getById(settingId, cashbox_id, user, project_id);
    },
    async getSettings(ctx) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const id = ctx.session.cashbox_id;
        const project_id = ctx.session.project_id;

        return this.settingService.getForTelegram(id, user, project_id);
    },
    async updateSetting(ctx) {
        const projectId = ctx.session.project_id;
        const cashboxId = ctx.session.cashbox_id;
        const user = await this.userService.getUser(ctx.session.user_id);

        const setting = ctx.session.entityData.setting;
        const value = ctx.session.entityData.value;

        const data = [
            {
                id: setting.id,
                value
            }
        ];

        //TODO change method
        return await this.settingService.update(cashboxId, user, data, projectId);
    }
}

export {
    cashboxServiceTg
}