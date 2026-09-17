import { DirectoryService } from "@services/DirectoryService";
import { CashboxEntity } from "../entities/Cashbox";
import type { Cashbox } from "../types";
import { PaginationParam } from "@shared-types/index";


export class CashboxRepository {
    constructor(private base: DirectoryService<'cashbox'>) {}

    async findById(id: number): Promise<CashboxEntity | null> {
        const data = await this.base.getById(id);
        if(!data) return null;
        return new CashboxEntity(data);
    }

    async findByProject(projectId: number): Promise<CashboxEntity[]> {
        const orderBy = {
            id: 'asc'
        }

        const data = await this.base.getByFields({ projectId }, {}, orderBy);
        return data.map((p: Cashbox) => new CashboxEntity(p));
    }

    async findDetailed(filter: any):Promise<CashboxEntity|null> {
        const data = await this.base.getFirstByFields(
            filter,
            {
                transactions: true,
                plans: {
                    orderBy: {
                        startDate: "desc"
                    }
                },
                settings: {
                    include: {
                        setting: true
                    }
                }
            }
        );
        if(!data) return null;

        return new CashboxEntity(data);
    }

    async findWithPagination(parameters: PaginationParam) {
        const paginationData = await this.base.getWithPagination(parameters); 
        const { currentPage, totalPages, totalItems, hasNextPage } = paginationData;
        
        const items = paginationData.items.map((p: Cashbox) => new CashboxEntity(p));
        return {
            items,
            pagination: {
                currentPage, 
                totalPages, 
                totalItems, 
                hasNextPage
            }
        }
    }

    async create(data: any): Promise<CashboxEntity | null> {
        const created = await this.base.createItem(data);
        if(!created) return null;
        return new CashboxEntity(created);
    }

    async update(id: number, data: any): Promise<CashboxEntity| null> {
        const updated = await this.base.updateItem(id, data);
        if(!updated) return null;
        return new CashboxEntity(updated);
    }

    async delete(id: number): Promise<CashboxEntity | null> {
        const deleted = await this.base.deleteItem(id);
        if(!deleted) return null;
        return new CashboxEntity(deleted);
    }
}