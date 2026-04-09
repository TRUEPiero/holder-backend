import { InlineKeyboard } from "grammy";
import { DirectoryService } from "@shared/DirectoryService";
import { ProjectService } from "../../project/src/modules/project/services";
import { CashboxService } from "../../project/src/modules/cashbox/services";
import { CashboxRepository } from "../../project/src/modules/cashbox/repository";
import { ProjectRepository } from "../../project/src/modules/project/repository";

type EntityType = "project" | "cashbox"

const projectBase = new DirectoryService<'project'>('project', ['cashbox']);
const projectRepo = new ProjectRepository(projectBase);
const projectService = new ProjectService(projectRepo);

const cashboxBase = new DirectoryService<'cashbox'>('cashbox', [])
const cashboxRepo = new CashboxRepository(cashboxBase);
const cashboxService = new CashboxService(cashboxRepo);

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

        const data = await service.getWithPagination({page, limit, fieldFilter});

        data!.items.map(({id, title}) => {
            return keyboard.text(title, `${entity}_${id}`).row()
        });

        if(data!.pagination) {
            const { currentPage, totalPages, totalItems, hasNextPage } = data!.pagination;
            const paginationKeyboard = this.pagination(entity, currentPage, totalPages, totalItems, hasNextPage)
            
            keyboard.append(paginationKeyboard)
        }

        return InlineKeyboard.from(keyboard)
    }
}
