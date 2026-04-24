import { BotContext } from "../../core/context";
import { container } from "../../../containers";
import { EntityService } from "../../interfaces/entity.service";

const {memberService, userService} = container;

const memberServiceTg: EntityService<'member'> = {
    baseService: memberService,
    settingService: null,
    userService: userService,

    getItem(id: number) {
        return this.baseService.getById(id)
    },
    getList(filter) {
        return this.baseService.getWithPagination(filter)
    },
    async getSettings(id: number) {
        return [];
    },
    async create(ctx: BotContext) {
        const username = ctx.session.entityData.username;
        const user = await this.userService.getTelegramUser(username);
        const projectId = ctx.session.project_id;

        return await this.baseService.create(projectId, user);
    },
    async update(ctx: BotContext){
        // const projectId = ctx.session.project_id;
        // const user = await this.userService.getUser(ctx.session.user_id);
        // const updateData = ctx.session.entityData;
        // const data = {
        //     title: updateData.title
        // }

        // return await this.baseService.update(user, projectId, data);
    },
    async delete(ctx: BotContext){
        // const projectId = ctx.session.project_id;
        // const user = await this.userService.getUser(ctx.session.user_id);

        // return await this.baseService.delete(user, projectId);
    },
}

export {
    memberServiceTg
}