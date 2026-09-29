import { InlineKeyboard } from "grammy"
import { EntityListFlags } from "../types"

interface EntityKeyboard {
    list(data: any, flags?: EntityListFlags): Promise<InlineKeyboard>
    item(): InlineKeyboard
}

export {
    EntityKeyboard
}