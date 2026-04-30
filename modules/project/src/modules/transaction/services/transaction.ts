import { PaginationParam } from "@shared-types/index.ts";
import { ProjectService } from "../../project/services";
import { TransactionRepository } from "../repository";
import { CreateData } from "../types";
import { InvalidFieldError, NotCreatedError, NotDeletedError, NotFoundError } from "@common/errors";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";

export class TransactionService {

    constructor(
        private repo: TransactionRepository,
        private projectService: ProjectService
    ) {}

    public async getById(id: number) {
        if(!id) throw new InvalidFieldError('ID');
        
        const transaction = await this.repo.findById(id);
        if (!transaction) throw new NotFoundError("TRANSACTION");
        return transaction;
    }

    public async getByCashbox(projectId: number, cashboxId: number, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:read');
        return await this.repo.findByCashbox(projectId, cashboxId)
    }

    public async getWithPagination(parameters: PaginationParam) {
        const transactions = await this.repo.findWithPagination(parameters);
        return transactions;
    }

    public async create(projectId: number, cashboxId: number, body: CreateData, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:create');

        const created = await this.repo.create(body);
        if(!created) throw new NotCreatedError("TRANSACTION");
    }

    public async delete(projectId: number, id: number, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:delete');

        const deleted = await this.repo.delete(id);
        if(!deleted) throw new NotDeletedError("TRANSACTION");

        return deleted;
    }
}