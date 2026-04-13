import { BotContext } from "../core/context";
import { Step } from "../types";

export abstract class BaseEntityHandler<T> {
  public abstract service: any;
  protected abstract ctx: BotContext

  public abstract getFilter(ctx: BotContext): Record<string, any>;
  protected abstract getFields(): { key: keyof T; title: string; visible: boolean }[];

  protected abstract renderList(page: number): Promise<any>;
  protected abstract renderItem(): Promise<any>;

  async render(step: Step) {
    const id = Number(step.id);

    switch (step.type) {
      case "page":
        await this.ctx.editMessageText("Список:", {
          reply_markup: await this.renderList(id),
        });
        break;
      case "item":
        const item = await this.service.getById(id);

        if(!step.entity) return;

        this.ctx.session[`${step.entity}_id`] = id;

        const text = this.buildMessage(item);

        await this.ctx.editMessageText(text, {
          reply_markup: await this.renderItem(),
        });
        break;
      case "settings":
        break;
    }
  }

  private buildMessage(entity: T): string {
    return this.getFields()
      .filter(f => f.visible)
      .map(f => `${f.title}: ${entity[f.key]}`)
      .join("\n");
  }
}