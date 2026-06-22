import { SettingEntity } from "../../project/src/modules/setting/entities/Setting"
import { SettingService } from "../../project/src/modules/setting/services/setting"
import { BotContext } from "../core/context"

interface EntitySettingsOwner {
    settingService: SettingService

    getSettings(ctx: BotContext): Promise<SettingEntity[]>
    getSetting(ctx: BotContext, settingId: number): Promise<SettingEntity>
    //TODO fix type
    updateSetting(ctx: BotContext): any
}

export {
    EntitySettingsOwner
}