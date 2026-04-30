import { BotContext } from "../core/context";
import { buildItemMessage, buildSettingsMessage } from "../lib/builder";
import { replyOrEdit } from "../lib/send-method";
import { EntityControllerParams, PaginationItem, Step } from "../types";
import { EntityConfig } from "../interfaces/entity.config";
import { EntityKeyboard } from "../interfaces/entity.keyboard";
import { EntityService } from "../interfaces/entity.service";

class EntityController {
    private service: EntityService<any>;
    private config: EntityConfig<any>
    private keyboard: EntityKeyboard

    private methods = {
        page: this.renderList.bind(this),
        item: this.renderItem.bind(this),
        settings: this.renderSettings.bind(this)
    }

    constructor(params: EntityControllerParams) {
        this.service = params.service;
        this.config = params.config;
        this.keyboard = params.keyboard
    }

    public async render(ctx: BotContext, step: Step, isCommand: boolean) {
        const type = step.type as 'page' | 'item' | 'settings';
        const id = Number(step.id);

        if(type === 'item') ctx.session[`${step.entity!}_id`] = id;

        const method = this.methods[type];
        await method(ctx, id, isCommand);
    }

    private async renderItem(ctx: BotContext, id: number, isCommand: boolean) {
        const item = await this.service.getItem(ctx);
        const text = buildItemMessage(item, this.config.fields);

        const method = replyOrEdit(ctx, isCommand);
        await method(text, {
            reply_markup: this.keyboard.item(),
        });
    }

    private async renderList(ctx: BotContext, id: number, isCommand: boolean) {
        const methodPage = replyOrEdit(ctx, isCommand);

        const filter = {
            page: id, 
            limit: 5, 
            fieldFilter: this.config.getFilter(ctx)
        }
    
        const data = await this.service.getList(filter)

        data.items.forEach((i: PaginationItem) => {
            i.title = this.config.getTitleKey(i);
        })

        await methodPage("Список:", {
            reply_markup: await this.keyboard.list(data),
        });
    }

    private async renderSettings(ctx: BotContext, id: number, isCommand: boolean) {
        const settings = await this.service.getSettings(ctx);
        const text = buildSettingsMessage(settings);

        const method = replyOrEdit(ctx, isCommand);
        await method(text, {
            reply_markup: await this.keyboard.settings(settings),
        });
    }
}

export {
    EntityController
}