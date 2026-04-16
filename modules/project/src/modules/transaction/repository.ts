import { DirectoryService } from "@shared/DirectoryService";
import { TransactionEntity } from "./entities/Transaction";
import { Transaction } from "./types";

export class TransactionRepository {
    constructor(private base: DirectoryService<"transaction">) {}
    
    async findById(id: number): Promise<TransactionEntity | null> {
        const data = await this.base.getById(id);
        if(!data) return null;

        return new TransactionEntity(data);
    }
    
    public async findByCashbox(projectId: number, cashboxId: number, query: any) {
        const data = await this.base.getByFields({
            AND: [
                {cashboxId},
                {cashbox: {
                    projectId
                }},
                {
                    ...query
                }
            ]
        })

        return data.map((t: Transaction) => new TransactionEntity(t))
    }

    async findWithPagination(parameters: any) {
        const paginationData = await this.base.getWithPagination(parameters); 
        const { currentPage, totalPages, totalItems, hasNextPage } = paginationData;
        
        const items = paginationData.items.map((t: Transaction) => new TransactionEntity(t));
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

    public async create(body: any) {
        const data = await this.base.createItem(body)
        return new TransactionEntity(data);
    }

    public async delete(id: number) {
        const deleted = await this.base.deleteItem(id);
        if(!deleted) return null;

        return new TransactionEntity(deleted);
    }
}