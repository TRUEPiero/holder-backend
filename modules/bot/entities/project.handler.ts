import { BaseEntityHandler } from "./base-entity.handler";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { container } from "../../containers";

export class ProjectHandler extends BaseEntityHandler<any> {
  service = container.projectService;

  constructor(protected ctx: BotContext) {
    super();
  }

  public getFilter() {
    return { ownerId: this.ctx.session.user_id };
  }

  protected getFields() {
    return [
      { key: "title", title: "Проект", visible: true}
    ];
  }

  protected async renderList(page: number) {
    return ItemsKeyboard.entityList("project", this.getFilter(), 5, page);
  }

  protected async renderItem() {
    return MenuKeyboard.projectMenu(this.ctx.session.project_id);
  }
}