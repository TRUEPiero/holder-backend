import { ItemsKeyboard } from "../../keyboards/list";
import { MenuKeyboard } from "../../keyboards/menu";
import { SettingKeyboard } from "../../keyboards/settings";
import { EntityKeyboard } from "../../interfaces/entity.keyboard";

const transactionKeyboard: EntityKeyboard = {
    item() {
        return MenuKeyboard.transactionMenu();
    },
    async list(data) {
        return ItemsKeyboard.entityList("transaction", data);
    },
    async settings(data) {
        return await SettingKeyboard.transactionSettings();
    },
}

export {
    transactionKeyboard
}