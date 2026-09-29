import { container } from "../../../containers";
import { EntityService } from "../../interfaces/entity.service";
import { EntitySettingsOwner } from "../../interfaces/owner-settings";

const {projectService, projectSettingService, userService} = container

const projectServiceTg: EntityService<'project'> & EntitySettingsOwner<'project'> = {
    baseService: projectService,
    settingService: projectSettingService,
    userService: userService,

    async getItem(ctx) {
        const user = await this.userService.getById(ctx.session.user_id);
        const id = ctx.session.project_id;

        return this.baseService.authorize(id, user, 'project:read')
    },
    getList(filter) {
        return this.baseService.getWithPagination(filter)
    },

    async create(ctx) {
        const user = await this.userService.getById(ctx.session.user_id);
        const createData = ctx.session.entityData;
        const data = {
            title: createData.title
        }

        return await this.baseService.create(user, data);
    },
    async update(ctx){
        const projectId = ctx.session.project_id;
        const user = await this.userService.getById(ctx.session.user_id);
        const updateData = ctx.session.entityData;
        const data = {
            title: updateData.title
        }

        return await this.baseService.update(projectId, user, data);
    },
    async delete(ctx){
        const projectId = ctx.session.project_id;
        const user = await this.userService.getById(ctx.session.user_id);

        return await this.baseService.delete(projectId, user);
    },

    async getSetting(ctx, settingId) {
        const user = await this.userService.getById(ctx.session.user_id);
        const project_id = ctx.session.project_id;

        return this.settingService.getById(settingId, project_id, user);
    },
    async getSettings(ctx) {
        const user = await this.userService.getById(ctx.session.user_id);
        const id = ctx.session.project_id;
        
        return this.settingService.getForTelegram(id, user);
    },
    async updateSetting(ctx) {
        const projectId = ctx.session.project_id;
        const user = await this.userService.getById(ctx.session.user_id);

        const setting = ctx.session.entityData.setting;
        const value = ctx.session.entityData.value;

        const data = [
            {
                id: setting.id,
                value
            }
        ];

        //TODO change method
        return await this.settingService.update(projectId, user, data);
    }
}

export {
    projectServiceTg
}