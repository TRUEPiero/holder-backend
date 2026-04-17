import { InlineKeyboard } from "grammy";
import { CommonKeyboard } from "./common";
import { EntityListOptions, EntityListFlags, EntityType, PaginationItem } from "../types";
import { container } from "../../containers";
import { MenuKeyboard } from "./menu";

const {cashboxService, projectService, transactionService, memberService} = container;

type Service = typeof projectService | typeof cashboxService | typeof transactionService | typeof memberService;

export class ItemsKeyboard {
    static pagination(object: EntityType, currentPage: number, hasNextPage?: boolean, totalPages?: number, totalItems?: number) {
        
        const prevPage: number | null = currentPage > 1 ? currentPage - 1: null;
        const nextPage: number | null = hasNextPage ? currentPage + 1 : null

        return new InlineKeyboard()
            .text(prevPage ? `<< ${prevPage}` : " ", `${object}_page_${prevPage}`)
            .text(`${currentPage}/${totalPages}`)
            .text(nextPage ? `${nextPage} >>` : " ", `${object}_page_${nextPage}`)

    }

    static async entityList(entity: EntityType, service: Service, filter: any, getTitle?: any, options: EntityListOptions = {}, flags: EntityListFlags = {}) {
        const {limit = 5, page = 1} = options;
        const { excludeId = null, withBackButton = true, isMember = false } = flags;

        if(excludeId) filter.id = {not: excludeId}

        const keyboard = new InlineKeyboard();

        if(isMember) keyboard.append(MenuKeyboard.memberInvite());

        const fieldFilter = filter;
        const data = await service.getWithPagination({page, limit, fieldFilter});

        data!.items.forEach((item: PaginationItem) => {
            const title = getTitle(item);

            return keyboard.text(title, `${entity}_${item.id}`).row()
        });

        if(data!.pagination) {
            const { currentPage, totalPages, totalItems, hasNextPage } = data!.pagination;
            const paginationKeyboard = this.pagination(entity, currentPage, hasNextPage, totalPages, totalItems)
            
            keyboard.append(paginationKeyboard)
        }
        
        if (withBackButton) keyboard.append(CommonKeyboard.back());

        return InlineKeyboard.from(keyboard)
    }
}
