import { ItemsKeyboard } from "../../keyboards/list";
import { MenuKeyboard } from "../../keyboards/menu";
import { SettingKeyboard } from "../../keyboards/settings";
import { EntityKeyboard } from "../../interfaces/entity.keyboard";

const cashboxKeyboard: EntityKeyboard = {
    item() {
        return MenuKeyboard.cashboxMenu();
    },
    async list(data, flag) {   
        return ItemsKeyboard.entityList("cashbox", data, flag);
    },
    async settings(data) {       
        return await SettingKeyboard.cashboxSettings(data);
    },
}

export {
    cashboxKeyboard
}