import { DirectoryService } from "@shared/DirectoryService";

export class TransactionService extends DirectoryService<'transaction'> {

    constructor() {
        super('transaction', ['cashbox'])
    }

    public async getTransactions(projectId: number, cashboxId: number) {
        return await this.getByFields({
            AND: [
                {cashboxId},
                {cashbox: {
                    projectId
                }}
            ]
        })
    }

    public async createTransaction(body: any) {
        return await this.createItem({
            ...body
        })
    }
}