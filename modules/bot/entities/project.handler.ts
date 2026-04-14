import { BaseEntityHandler } from "./base-entity.handler";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { container } from "../../containers";
import { SettingKeyboard } from "../keyboards/settings";

export class ProjectHandler extends BaseEntityHandler<any> {
  private userService = container.userService;
  protected service = container.projectService;
  protected settingService = container.projectSettingService;

  constructor(protected ctx: BotContext) {
    super();
  }

  public getFilter() {
    return { ownerId: this.ctx.session.user_id };
  }

  public async delete() {
    const user = await this.userService.getUser(this.ctx.session.user_id);

    return await this.service.delete(user, this.ctx.session.project_id);
  }

  public async create() {
    const user = await this.userService.getUser(this.ctx.session.user_id);
    const createData = this.ctx.session.entityData;
    const data = {
      title: createData.title
    }

    return await this.service.create(user, data);
  }

  protected getFields() {
    return [
      { key: "title", title: "Проект", visible: true }
    ];
  }

  protected async renderList(page: number) {
    return ItemsKeyboard.entityList("project", this.getFilter(), 5, page);
  }

  protected async renderItem() {
    return MenuKeyboard.projectMenu();
  }

  protected async renderSettings() {
    return SettingKeyboard.ProjectSettings(this.ctx.session.project_id);
  }
}