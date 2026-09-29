import { ItemsKeyboard } from "../../keyboards/list";
import { MenuKeyboard } from "../../keyboards/menu";
import { EntityKeyboard } from "../../interfaces/entity.keyboard";

const transactionKeyboard: EntityKeyboard = {
    item() {
        return MenuKeyboard.transactionMenu();
    },
    async list(data) {
        return ItemsKeyboard.entityList("transaction", data);
    },
}

export {
    transactionKeyboard
}