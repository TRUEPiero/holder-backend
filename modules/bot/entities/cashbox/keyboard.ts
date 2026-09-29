import { ItemsKeyboard } from "../../keyboards/list";
import { MenuKeyboard } from "../../keyboards/menu";
import { SettingKeyboard } from "../../keyboards/settings";
import { EntityKeyboard } from "../../interfaces/entity.keyboard";
import { EntityListFlags } from "../../types";
import { EntitySettingKeyboard } from "../../interfaces/owner-settings";

const cashboxKeyboard: EntityKeyboard & EntitySettingKeyboard = {
    item() {
        return MenuKeyboard.cashboxMenu();
    },
    async list(data) {
        const flags: EntityListFlags = {
            create: true
        };

        return ItemsKeyboard.entityList("cashbox", data, flags);
    },
    async settings(data) {       
        return await SettingKeyboard.cashboxSettings(data);
    },
}

export {
    cashboxKeyboard
}