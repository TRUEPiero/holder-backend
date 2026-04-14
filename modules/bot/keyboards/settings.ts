import { InlineKeyboard } from "grammy";
import { container } from "../../containers";
import { CommonKeyboard } from "./common";

const {projectSettingService, cashboxSettingService} = container;


export class SettingKeyboard {
    static async ProjectSettings(projectId: number) {
        const keyboard = new InlineKeyboard();
        
        const data = await projectSettingService.getForTelegram(projectId);
        
        data.forEach((setting, index) => {
            const key = keyboard.text(`Edit ${setting.title}`, `project_setting_${setting.id}`)

            if(index++ && index++ % 3 === 0) key.row();
        })

        keyboard.append(CommonKeyboard.back())
        return InlineKeyboard.from(keyboard)
    }

    static async CashboxSetting(cashboxId: number) {
        const keyboard = new InlineKeyboard();
        
        const data = await cashboxSettingService.getForTelegram(cashboxId);

        data.forEach((setting, index) => {
            const key = keyboard.text(`Edit ${setting.title}`, `cashbox_setting_${setting.id}`)

            if(index++ && index++ % 3 === 0) key.row();
        })

        keyboard.append(CommonKeyboard.back())
        return InlineKeyboard.from(keyboard)
    }

    static async TransactionSetting() {
        return new InlineKeyboard();
    }
}