import { container } from "../../containers";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { SettingKeyboard } from "../keyboards/settings";
import { BaseEntityHandler } from "./base-entity.handler";
import { Member } from "../../project/src/modules/member/types";
import { MemberRoles } from "../types";

export class MemberHandler extends BaseEntityHandler<any> {
    service = container.memberService;
    settingService = undefined;
    userService = container.userService;

    constructor(protected ctx: BotContext) {
        super()
    }

    public getFilter() {
        return { projectId: this.ctx.session.project_id };
    }

    //
    public async create() {
        const username = this.ctx.session.entityData.username;
        const user = await this.userService.getTelegramUser(username);
        const projectId = this.ctx.session.project_id;

        return await this.service.create(projectId, user);
    }

    public async update() {
        const user = await this.userService.getUser(this.ctx.session.user_id);
        const projectId = this.ctx.session.project_id;
        const createData = this.ctx.session.entityData;
        const data = {
            title: createData.title
        }

        // return await this.service.update(user, projectId, data);
    }

    public async delete() {
        const user = await this.userService.getUser(this.ctx.session.user_id);

        // return await this.service.delete(user, this.ctx.session.project_id);
    }

    protected getId() {
        return this.ctx.session.member_id;
    }

    protected getFields() {
        return [
            { key: "user.name", title: "Имя", visible: true },
            { key: "role", title: "Роль", visible: true, formatter: (value: MemberRoles) => value === 'editor' ? "Редактор" : "Зритель"},
            { key: "user.telegram", title: "TG", visible: true, formatter: (value: string) => `@${value}` }
        ];
    }

    protected async renderList(page: number) {
        const flags = {
            isMember: true,
        }

        return ItemsKeyboard.entityList("member", this.service, this.getFilter(), this.getTitleKey, {}, flags);
    }

    protected async renderItem() {
        return MenuKeyboard.memberMenu();
    }

    protected async renderSettings() {
        return await SettingKeyboard.memberSettings();
    }

    private getTitleKey(item: Member) {
        return `${item.user!.name} (${item.role})`
    }
}