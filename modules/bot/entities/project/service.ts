import { container } from "../../../containers";
import { BotContext } from "../../core/context";
import { EntityService } from "../../interfaces/entity.service";

const {projectService, projectSettingService, userService} = container

const projectServiceTg: EntityService<'project'> = {
    baseService: projectService,
    settingService: projectSettingService,
    userService: userService,

    async getItem(ctx: BotContext) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const id = ctx.session.project_id;

        return this.baseService.getById(id, user)
    },
    getList(filter) {
        return this.baseService.getWithPagination(filter)
    },
    async getSettings(ctx: BotContext) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const id = ctx.session.project_id;
        
        return this.settingService!.getForTelegram(id, user);
    },
    async create(ctx: BotContext) {
        const user = await this.userService.getUser(ctx.session.user_id);
        const createData = ctx.session.entityData;
        const data = {
            title: createData.title
        }

        return await this.baseService.create(user, data);
    },
    async update(ctx: BotContext){
        const projectId = ctx.session.project_id;
        const user = await this.userService.getUser(ctx.session.user_id);
        const updateData = ctx.session.entityData;
        const data = {
            title: updateData.title
        }

        return await this.baseService.update(user, projectId, data);
    },
    async delete(ctx: BotContext){
        const projectId = ctx.session.project_id;
        const user = await this.userService.getUser(ctx.session.user_id);

        return await this.baseService.delete(user, projectId);
    },
}

export {
    projectServiceTg
}