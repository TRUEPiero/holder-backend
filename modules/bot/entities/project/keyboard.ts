import { ItemsKeyboard } from "../../keyboards/list";
import { MenuKeyboard } from "../../keyboards/menu";
import { SettingKeyboard } from "../../keyboards/settings";
import { EntityKeyboard } from "../../interfaces/entity.keyboard";

const projectKeyboard: EntityKeyboard = {
    item() {
        return MenuKeyboard.projectMenu();
    },
    async list(data) {   
        return ItemsKeyboard.entityList("project", data);
    },
    async settings(data) {       
        return await SettingKeyboard.projectSettings(data);
    },
}

export {
    projectKeyboard
}