import { ItemsKeyboard } from "../../keyboards/list";
import { MenuKeyboard } from "../../keyboards/menu";
import { EntityKeyboard } from "../../interfaces/entity.keyboard";

const memberKeyboard: EntityKeyboard = {
    item() {
        return MenuKeyboard.memberMenu();
    },
    
    async list(data) {
        const flags = {
            isMember: true,
        }
        
        return ItemsKeyboard.entityList("member", data, flags);
    },
}

export {
    memberKeyboard
}