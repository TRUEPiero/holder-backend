import { Decimal } from "@prisma/client/runtime/library";
import { container } from "../../containers";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { SettingKeyboard } from "../keyboards/settings";
import { BaseEntityHandler } from "./base-entity.handler";
import { EntityListFlags, EntityListOptions } from "../types";

export class CashboxHandler extends BaseEntityHandler<any> {
  private userService = container.userService;
  protected service = container.cashboxService;
  protected settingService = container.cashboxSettingService;

  constructor(protected ctx: BotContext) {
    super();
  }

  public getFilter() {
    return { projectId: this.ctx.session.project_id };
  }

  public async create() {
    const createData = this.ctx.session.entityData;

    const data = {
      title: createData.title,
    }
    const user = await this.userService.getUser(this.ctx.session.user_id);

    return await this.service.create(this.ctx.session.project_id, data, user);
  }

  public async update() {
    const user = await this.userService.getUser(this.ctx.session.user_id);
    const projectId = this.ctx.session.project_id;

    const updateData = this.ctx.session.entityData;
    const data = {
      title: updateData.title
    }

    return await this.service.update(projectId, this.getId(), data, user);
  }
    
  public async delete() {
    const user = await this.userService.getUser(this.ctx.session.user_id);

    return await this.service.delete(
      this.ctx.session.project_id,
      this.getId(),
      user
    );
  }

  protected getId() {
    return this.ctx.session.cashbox_id;
  }

  protected getFields() {
    return [
      { key: "title", title: "Счет", visible: true },
      {
        key: "balance", 
        title: "Баланс", 
        visible: true, 
        formatter: (value: number | string) => new Decimal(value).toFixed(2) 
      },
    ];
  }

  public async renderListForChoice(currentId: number, page: number) {
    const flags: EntityListFlags = {
      excludeId: currentId,
      withBackButton: false
    };

    const options: EntityListOptions = {
      limit: 5, 
      page
    }
    
    return ItemsKeyboard.entityList("cashbox", this.service, this.getFilter(), this.getTitleKey, options, flags);
  }

  protected async renderList(page: number) {
    const options: EntityListOptions = {
      limit: 5, 
      page
    }

    return ItemsKeyboard.entityList("cashbox", this.service, this.getFilter(), this.getTitleKey, options);
  }

  protected async renderItem() {
    return MenuKeyboard.cashboxMenu();
  }

  protected async renderSettings() {
    return await SettingKeyboard.cashboxSetting(this.getId(), this.settingService);
  }

  private getTitleKey(item: any) {
    return item.title
  }
}