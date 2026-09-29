import { EntitySettingKeyboard } from "../../interfaces/owner-settings";
import { SettingKeyboard } from "../../keyboards/settings";

export const userKeyboard: EntitySettingKeyboard = {
    async settings(data) {       
        return await SettingKeyboard.userSettings(data);
    },
}
