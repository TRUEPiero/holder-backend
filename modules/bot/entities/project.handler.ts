import { BaseEntityHandler } from "./base-entity.handler";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { container } from "../../containers";
import { SettingKeyboard } from "../keyboards/settings";
import { EntityListOptions } from "../types";
import { Project } from "../../project/src/modules/project/types";

export class ProjectHandler extends BaseEntityHandler<any> {
  protected userService = container.userService;
  protected service = container.projectService;
  protected settingService = container.projectSettingService;

  constructor(protected ctx: BotContext) {
    super();
  }

  public getFilter() {
    const userId = this.ctx.session.user_id;

    return {
      OR: [
          {ownerId: userId},
          {members: {
              some: {
                  userId
              }
          }}
      ]
    };
  }       

  public async getSetting(id: number) {
    const setting = await this.settingService.getById(id, this.getId());
    return setting;
  }

  public async create() {
    const user = await this.userService.getUser(this.ctx.session.user_id);
    const updateData = this.ctx.session.entityData;
    const data = {
      title: updateData.title
    }

    return await this.service.create(user, data);
  }

  public async update() {
    const user = await this.userService.getUser(this.ctx.session.user_id);
    const createData = this.ctx.session.entityData;
    const data = {
      title: createData.title
    }

    return await this.service.update(user, this.getId(), data);
  }

  public async delete() {
    const user = await this.userService.getUser(this.ctx.session.user_id);

    return await this.service.delete(user, this.getId());
  }

  protected getId() {
    return this.ctx.session.project_id;
  }

  protected getFields() {
    return [
      { key: "title", title: "Проект", visible: true },
    ];
  }

  protected async renderList(page: number) {
    const options: EntityListOptions = {
      limit: 5, 
      page
    }

    return ItemsKeyboard.entityList("project", this.service, this.getFilter(), this.getTitleKey, options);
  }

  protected async renderItem() {
    return MenuKeyboard.projectMenu();
  }

  protected async renderSettings() {
    return await SettingKeyboard.projectSettings(this.getId(), this.settingService);
  }

  private getTitleKey(item: Project) {
    return item.title
  }
}