import { InlineKeyboard } from "grammy";
import { ProjectService } from "../../project/services/project";
import { CashboxService } from "../../project/services/cashbox";

type EntityType = "project" | "cashbox"

const projectService = new ProjectService();
const cashboxService = new CashboxService();

const services: Record<string, typeof projectService | typeof cashboxService> = {
    project: projectService,
    cashbox: cashboxService
}

export class ItemsKeyboard {
    static pagination(object: EntityType, currentPage: any, totalPages: number, totalItems: any, hasNextPage: boolean) {
        
        const prevPage: number | null = currentPage > 1 ? currentPage - 1: null;
        const nextPage: number | null = hasNextPage ? currentPage + 1 : null

        return new InlineKeyboard()
            .text(prevPage ? `<< ${prevPage}` : " ", `${object}_page_${prevPage}`)
            .text(`${currentPage}/${totalPages}`)
            .text(nextPage ? `${nextPage} >>` : " ", `${object}_page_${nextPage}`)

    }

    static async entityList(entity: EntityType, filter: any, limit = 5, page = 1) {
        const keyboard = new InlineKeyboard();

        const service = services[entity];
        const fieldFilter = JSON.stringify(filter);

        const items = await service.getWithPagination({page, limit, fieldFilter});

        items.data.map((id: number, title: string) => keyboard.text(title, `${entity}_${id}`).row());

        if(items.pagination) {
            const { currentPage, totalPages, totalItems, hasNextPage } = items.pagination;
            const paginationKeyboard = this.pagination(entity, currentPage, totalPages, totalItems, hasNextPage)
            
            keyboard.append(paginationKeyboard)
        }

        return InlineKeyboard.from(keyboard)
    }
}
