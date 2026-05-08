import { BotContext } from "../../core/context";
import { container } from "../../../containers";
import { EntityService } from "../../interfaces/entity.service";

const {memberService, userService} = container;

const memberServiceTg: EntityService<'member'> = {
    baseService: memberService,
    settingService: null,
    userService: userService,

    async getItem(ctx) {
        const id = ctx.session.member_id;
        
        return this.baseService.getById(id)
    },
    getList(filter) {
        return this.baseService.getWithPagination(filter)
    },
    async create(ctx: BotContext) {
        const telegram = ctx.session.entityData.username;
        const filter = {
            telegram
        }

        const user = await this.userService.getTelegramUser(filter);
        if(!user) return null;

        const projectId = ctx.session.project_id;

        return await this.baseService.create(projectId, user);
    },
    async update(ctx: BotContext){
        
    },
    async delete(ctx: BotContext){

    },
}

export {
    memberServiceTg
}