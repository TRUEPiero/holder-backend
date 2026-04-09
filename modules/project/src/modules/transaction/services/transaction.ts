import { TransactionRepository } from "../repository";

export class TransactionService {

    constructor(private repo: TransactionRepository) {}

    public async getByIdTransactions(projectId: number, cashboxId: number, query: any = {}) {
        return await this.repo.findByCashbox(projectId, cashboxId, query)
    }

    public async createTransaction(body: any) {
        return await this.repo.create(body)
    }
}