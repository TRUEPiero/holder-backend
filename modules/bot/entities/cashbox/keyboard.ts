import { ItemsKeyboard } from "../../keyboards/list";
import { MenuKeyboard } from "../../keyboards/menu";
import { SettingKeyboard } from "../../keyboards/settings";
import { EntityKeyboard } from "../../interfaces/entity.keyboard";
import { EntityListFlags } from "../../types";

const cashboxKeyboard: EntityKeyboard = {
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