import { InlineKeyboard } from "grammy";
import { container } from "../../containers";
import { CommonKeyboard } from "./common";
import { EntityType } from "../types";
import { SettingEntity } from "../../project/src/modules/settings/entities/Setting";

const {projectSettingService, cashboxSettingService} = container;

type SettingService = typeof projectSettingService | typeof cashboxSettingService;

export class SettingKeyboard {
    static async projectSettings(data: SettingEntity[]) {
        const keyboard = new InlineKeyboard();
        
        keyboard.text('Пользователи', 'member_page_1')
                .text('Переименовать', 'project_rename')

        const settings = await this.commonSettings('project', data);

        keyboard.append(settings, CommonKeyboard.back())
        return InlineKeyboard.from(keyboard)
    }

    static async cashboxSettings(data: SettingEntity[]) {

        const keyboard = new InlineKeyboard();
        
        keyboard.text('Переименовать', 'cashbox_rename')

        const settings = await this.commonSettings('cashbox', data);

        keyboard.append(settings, CommonKeyboard.back())
        return InlineKeyboard.from(keyboard)
    }

    static async transactionSettings() {
        return new InlineKeyboard();
    }

    static async memberSettings() {
        return new InlineKeyboard();
    }

    private static async commonSettings(entity: EntityType, data: SettingEntity[]) {
        const keyboard = new InlineKeyboard();
                
        data.forEach((setting, index) => {
            const key = keyboard.text(`Edit ${setting.getTitle()}`, `${entity}_setting_${setting.getId()}`)

            if(index++ && index++ % 3 === 0) key.row();
        })

        return keyboard;
    }
}