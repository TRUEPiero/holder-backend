import { InlineKeyboard } from "grammy"
import { SettingEntity } from "../../project/src/modules/setting/entities/Setting"
import { SettingService } from "../../project/src/modules/setting/services/setting"
import { BotContext } from "../core/context"
import { BaseService, ServiceMap } from "./entity.service"

interface EntitySettingsOwner<K extends keyof ServiceMap> extends BaseService<K> {
    settingService: SettingService

    getSettings(ctx: BotContext): Promise<SettingEntity[]>
    getSetting(ctx: BotContext, settingId: number): Promise<SettingEntity>
    //TODO fix type
    updateSetting(ctx: BotContext): any
}

interface EntitySettingKeyboard {
    settings(data: any): Promise<InlineKeyboard>
}

export {
    EntitySettingsOwner,
    EntitySettingKeyboard
}