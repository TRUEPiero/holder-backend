import { Decimal } from "@prisma/client/runtime/library";
import { BotContext } from "../core/context";
import { Step } from "../types";

export abstract class BaseEntityHandler<T> {
  protected abstract service: any;
  protected abstract settingService: any;
  protected abstract ctx: BotContext

  public abstract getFilter(ctx: BotContext): Record<string, any>;
  
  public abstract create(): any;
  public abstract update(): any;
  public abstract delete(): any;
  protected abstract getId(): number 
  protected abstract getFields(): { key: keyof T; title: string; visible: boolean, formatter?:  any}[];

  protected abstract renderList(page: number): Promise<any>;
  protected abstract renderItem(): Promise<any>;
  protected abstract renderSettings(): Promise<any>;

  async render(step: Step, isCommand: boolean) {
    const id = Number(step.id);

    switch (step.type) {
      case "page":
        const methodPage = isCommand ? this.ctx.reply.bind(this.ctx) : this.ctx.editMessageText.bind(this.ctx)

        await methodPage("Список:", {
          reply_markup: await this.renderList(id),
        });
        break;
      case "item":
        const item = await this.service.getById(id);

        if(!step.entity) return;

        this.ctx.session[`${step.entity}_id`] = id;

        const text = this.buildDetailMessage(item);

        const methodItem = isCommand ? this.ctx.reply.bind(this.ctx) : this.ctx.editMessageText.bind(this.ctx)
        await methodItem(text, {
          reply_markup: await this.renderItem(),
        });
        break;
      case "settings":
        const settings = await this.settingService.getForTelegram(this.getId())
        const settingMsg = this.buildSettingsMessage(settings);

        await this.ctx.editMessageText(settingMsg, {
          reply_markup: await this.renderSettings() 
        })
        break;
    }
  }

  private buildDetailMessage(entity: T): string {
    return this.getFields()
      .filter(f => f.visible)
      .map(f => {
          const rawValue = this.getValueByPath(entity, f.key as string);
          const value = f.formatter
              ? f.formatter(rawValue, entity)
              : rawValue;

          return `${f.title}: ${value}`;
      })
      .join("\n");
  }

  private buildSettingsMessage(settings: any[]) {
    let res = `Настройки\n`

    res += settings
      .filter(s => s.type === "boolean")
      .map(s => `${s.title}: ${s.value ? 'on' : 'off'}`)
      .join("\n")

    return res;
  }

  private getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }
}