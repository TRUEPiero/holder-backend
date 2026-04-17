import { InlineKeyboard } from "grammy";
import { container } from "../../containers";
import { CommonKeyboard } from "./common";
import { EntityType } from "../types";

const {projectSettingService, cashboxSettingService} = container;

type SettingService = typeof projectSettingService | typeof cashboxSettingService;

export class SettingKeyboard {
    static async projectSettings(projectId: number, settingService: SettingService) {
        const keyboard = new InlineKeyboard();
        
        keyboard.text('Пользователи', 'member_page_1')
                .text('Переименовать', 'project_rename')

        const settings = await this.commonSettings('project', projectId, settingService);

        keyboard.append(settings, CommonKeyboard.back())
        return InlineKeyboard.from(keyboard)
    }

    static async cashboxSetting(cashboxId: number, settingService: SettingService) {

        const keyboard = new InlineKeyboard();
        
        keyboard.text('Переименовать', 'cashbox_rename')

        const settings = await this.commonSettings('cashbox', cashboxId, settingService);

        keyboard.append(settings, CommonKeyboard.back())
        return InlineKeyboard.from(keyboard)
    }

    static async transactionSetting() {
        return new InlineKeyboard();
    }

    static async memberSetting() {
        return new InlineKeyboard();
    }

    private static async commonSettings(entity: EntityType, entityId: number, service: SettingService) {
        const keyboard = new InlineKeyboard();
        
        const data = await service.getForTelegram(entityId);
        
        data.forEach((setting, index) => {
            const key = keyboard.text(`Edit ${setting.title}`, `${entity}_setting_${setting.id}`)

            if(index++ && index++ % 3 === 0) key.row();
        })

        return keyboard;
    }
}