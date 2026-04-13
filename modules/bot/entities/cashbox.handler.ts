import { container } from "../../containers";
import { BotContext } from "../core/context";
import { ItemsKeyboard } from "../keyboards/list";
import { MenuKeyboard } from "../keyboards/menu";
import { BaseEntityHandler } from "./base-entity.handler";

export class CashboxHandler extends BaseEntityHandler<any> {
  service = container.cashboxService;

  constructor(protected ctx: BotContext) {
    super();
  }

  public getFilter() {
    return { projectId: this.ctx.session.project_id };
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
    return MenuKeyboard.cashboxMenu(this.ctx.session.cashbox_id);
  }
}