import { ProjectService } from "../../project/services";
import { TransactionRepository } from "../repository";
import { CreateData } from "../types";

export class TransactionService {

    constructor(
        private repo: TransactionRepository,
        private projectService: ProjectService
    ) {}

    public async getById(id: number) {
        const transaction = await this.repo.findById(id);
        if (!transaction) throw new Error("TRANSACTION_NOT_FOUND");
        return transaction;
    }

    public async getByCashbox(projectId: number, cashboxId: number, query: any = {}) {
        return await this.repo.findByCashbox(projectId, cashboxId, query)
    }

    public async getWithPagination(parameters: any) {
        const transactions = await this.repo.findWithPagination(parameters);
        return transactions;
    }

    public async create(body: CreateData) {
        return await this.repo.create(body)
    }

    public async delete(projectId: number, id: number, user: any) {
        const project = await this.projectService.getDetail(projectId);

        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        const deleted = await this.repo.delete(id);
        if(!deleted) throw new Error("TRANSACTION_NOT_DELETED");

        return deleted;
    }
}