import { TransactionRepository } from "../repository";

export class TransactionService {

    constructor(private repo: TransactionRepository) {}

    public async getCashboxTransactions(projectId: number, cashboxId: number, query: any = {}) {
        return await this.repo.findByCashbox(projectId, cashboxId, query)
    }

    public async createTransaction(body: any) {
        return await this.repo.create(body)
    }
}