import { TransactionRepository } from "../repository";

export class TransactionService {

    constructor(private repo: TransactionRepository) {}

    public async getByCashbox(projectId: number, cashboxId: number, query: any = {}) {
        return await this.repo.findByCashbox(projectId, cashboxId, query)
    }

    public async getWithPagination(settings: any) {
        const transactions = await this.repo.findWithPagination(settings);
        return transactions;
    }

    public async create(body: any) {
        return await this.repo.create(body)
    }
}