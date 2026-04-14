import { container } from "../../containers";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { SettingKeyboard } from "../keyboards/settings";
import { BaseEntityHandler } from "./base-entity.handler";

export class CashboxHandler extends BaseEntityHandler<any> {
  private userService = container.userService;
  protected service = container.cashboxService;
  protected settingService = container;

  constructor(protected ctx: BotContext) {
    super();
  }

  public getFilter() {
    return { projectId: this.ctx.session.project_id };
  }
  
  public async delete() {
    const user = await this.userService.getUser(this.ctx.session.user_id);

    return await this.service.delete(
      this.ctx.session.project_id,
      this.ctx.session.cashbox_id,
      user
    );
  }

  public async create() {
    const createData = this.ctx.session.entityData;

    const data = {
      title: createData.title,
    }
    const user = await this.userService.getUser(this.ctx.session.user_id);

    return await this.service.create(this.ctx.session.project_id, data, user);
  }

  protected getFields() {
    return [
      { key: "title", title: "Счет", visible: true },
      { key: "balance", title: "Баланс", visible: true },
    ];
  }

  protected async renderList(page: number) {
    return ItemsKeyboard.entityList("cashbox", this.getFilter(), 5, page);
  }

  protected async renderItem() {
    return MenuKeyboard.cashboxMenu();
  }

  protected async renderSettings() {
    // return SettingKeyboard.ProjectSettings(this.ctx.session.project_id);
  }
}