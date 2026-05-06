import { CashboxEntity } from "../../project/src/modules/cashbox/entities/Cashbox"
import { ProjectEntity } from "../../project/src/modules/project/entities/Project"
import { SettingEntity } from "../../project/src/modules/settings/entities/Setting"
import { BotContext } from "../core/context"

interface EntitySettingsOwner {
    getSettings(ctx: BotContext): Promise<SettingEntity[]>
    getSetting(ctx: BotContext, settingId: number): Promise<SettingEntity>
    updateSetting(ctx: BotContext): Promise<ProjectEntity | CashboxEntity>
}

export {
    EntitySettingsOwner
}