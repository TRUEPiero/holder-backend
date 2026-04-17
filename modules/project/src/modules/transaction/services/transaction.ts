import { PaginationParam } from "@shared-types/index.ts";
import { ProjectService } from "../../project/services";
import { TransactionRepository } from "../repository";
import { CreateData } from "../types";

export class TransactionService {

    constructor(
        private repo: TransactionRepository,
        private projectService: ProjectService
    ) {}

    public async getById(id: number) {
        if(!id) throw new Error("ID_NOT_VALID");
        
        const transaction = await this.repo.findById(id);
        if (!transaction) throw new Error("TRANSACTION_NOT_FOUND");
        return transaction;
    }

    public async getByCashbox(projectId: number, cashboxId: number) {
        return await this.repo.findByCashbox(projectId, cashboxId)
    }

    public async getWithPagination(parameters: PaginationParam) {
        const transactions = await this.repo.findWithPagination(parameters);
        return transactions;
    }

    public async create(body: CreateData) {
        const created = await this.repo.create(body);
        if(!created) throw new Error("TRANSACTION_NOT_CREATED");
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