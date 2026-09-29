import { container } from "../../../containers";
import { EntitySettingsOwner } from "../../interfaces/owner-settings";

const { userSettingService, userService} = container

export const userServiceTg: EntitySettingsOwner<'user'> = {
    baseService: userService,
    settingService: userSettingService,

    async getSetting(ctx, settingId) {
        const user = await this.baseService.getById(ctx.session.user_id);
        const project_id = ctx.session.project_id;

        return this.settingService.getById(settingId, project_id, user);
    },

    async getSettings(ctx) {
        const user = await this.baseService.getById(ctx.session.user_id);
        const id = ctx.session.project_id;
        
        return this.settingService.getForTelegram(id, user);
    },

    updateSetting(ctx) {
        
    },
}
