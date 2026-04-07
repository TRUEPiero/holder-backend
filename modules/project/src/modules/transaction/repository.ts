import { DirectoryService } from "@shared/DirectoryService";
import { TransactionEntity } from "./entities/Transaction";
import { Transaction } from "./types";

export class TransactionRepository {
    constructor(private base: DirectoryService<"transaction">) {}
    
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

    public async create(body: any) {
        const data = await this.base.createItem(body)
        return new TransactionEntity(data);
    }
}