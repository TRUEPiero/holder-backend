import { InlineKeyboard } from "grammy";
import { CommonKeyboard } from "./common";
import { EntityListFlags, EntityType, PaginationItem } from "../types";
import { MenuKeyboard } from "./menu";

export class ItemsKeyboard {
    static pagination(object: EntityType, currentPage: number, hasNextPage?: boolean, totalPages?: number, totalItems?: number) {
        
        const prevPage: number | null = currentPage > 1 ? currentPage - 1: null;
        const nextPage: number | null = hasNextPage ? currentPage + 1 : null

        return new InlineKeyboard()
            .text(prevPage ? `<< ${prevPage}` : " ", `${object}_page_${prevPage}`)
            .text(`${currentPage}/${totalPages}`)
            .text(nextPage ? `${nextPage} >>` : " ", `${object}_page_${nextPage}`)

    }

    static async entityList(entity: EntityType, data: any, flags: EntityListFlags = {}) {
        const { withBackButton = true, isMember = false } = flags;

        const keyboard = new InlineKeyboard();

        if(isMember) keyboard.append(MenuKeyboard.memberInvite());

        data.items.forEach((item: PaginationItem) => {
            return keyboard.text(item.title, `${entity}_${item.id}`).row()
        });

        if(data.pagination) {
            const { currentPage, totalPages, totalItems, hasNextPage } = data!.pagination;
            const paginationKeyboard = this.pagination(entity, currentPage, hasNextPage, totalPages, totalItems)
            
            keyboard.append(paginationKeyboard)
        }
        
        if (withBackButton) keyboard.append(CommonKeyboard.back());

        return InlineKeyboard.from(keyboard)
    }
}
