import { BotContext } from "../core/context";
import { buildItemMessage, buildSettingsMessage } from "../lib/message-builder";
import { replyOrEdit } from "../lib/send-method";
import { EntityControllerParams, PaginationItem, Step } from "../types";
import { EntityConfig } from "../interfaces/entity.config";
import { EntityKeyboard } from "../interfaces/entity.keyboard";
import { EntityService } from "../interfaces/entity.service";
import { EntitySettingKeyboard, EntitySettingsOwner } from "../interfaces/owner-settings";

class EntityController {
    private service: EntityService<any> & EntitySettingsOwner<any>;
    private config: EntityConfig<any>
    private keyboard: EntityKeyboard & EntitySettingKeyboard

    private methods = {
        page: this.renderList.bind(this),
        item: this.renderItem.bind(this),
        settings: this.renderSettings.bind(this),
        listForChoice: this.renderListForChoice.bind(this),
        start: null
    }

    constructor(params: EntityControllerParams) {
        this.service = params.service;
        this.config = params.config;
        this.keyboard = params.keyboard
    }

    public async render(ctx: BotContext, step: Step, isCommand: boolean) {
        const type = step.type;
        const id = Number(step.id);
        const currentid = Number(step.currentId);

        if(type === 'item') ctx.session[`${step.entity!}_id`] = id;

        const method = this.methods[type];
        if(!method) return;
        
        await method(ctx, id, isCommand, currentid);
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

    private async renderListForChoice(ctx: BotContext, id: number, isCommand: boolean, currentId: number) {
        const methodPage = replyOrEdit(ctx, isCommand);

        const filter = this.config.getFilter(ctx);
        filter.id = {not: currentId};

        const params = {
            page: id, 
            limit: 5,
            fieldFilter: filter
        }

        const flags = {
            withBackButton: false,
            isChoice: true
        };
    
        const data = await this.service.getList(params)
        
        data.items.forEach((i: PaginationItem) => {
            i.title = this.config.getTitleKey(i);
        });

        await methodPage("Выберите счет:", {
            reply_markup: await this.keyboard.list(data, flags),
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