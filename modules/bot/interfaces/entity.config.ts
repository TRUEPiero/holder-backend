import { BotContext } from "../core/context"

interface EntityConfig<T> {
    fields: {
        key: string;
        title: string;
        visible: boolean;
        formatter?: (value: any, entity: T) => string;
    }[];

    getTitleKey: (item: T) => string;
    getId(ctx: BotContext): number;
    getFilter(ctx: BotContext): any
}

export {
    EntityConfig
}