import { PaginationParam } from "@shared-types/index.ts";
import { ProjectService } from "../../project/services";
import { TransactionRepository } from "../repositories/transaction";
import { CreateData, Query } from "../types";
import { InvalidFieldError, NotCreatedError, NotDeletedError, NotFoundError } from "@common/errors";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { CasheService } from "@services/CasheService";

export class TransactionService {

    constructor(
        private repo: TransactionRepository,
        private cashe: CasheService,
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

    public async getByFilter(projectId: number, cashboxId: number, query: Query, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:read');
        const filter = {
            cashboxId,
            tags: query?.tags ? 
                {
                    in: query?.tags
                } : undefined
        }

        const include = {
            tags: true
        }

        const transaction = await this.repo.findByFilter(filter, include);
        if(!transaction) throw new NotFoundError("TRANSACTION");

        return transaction;
    }

    public async getWithPagination(parameters: PaginationParam) {
        const transactions = await this.repo.findWithPagination(parameters);
        return transactions;
    }

    public async create(projectId: number, cashboxId: number, body: CreateData, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:create');
        const createdData = {
            ...body,
            cashboxId,
        };

        const created = await this.repo.create(createdData);
        if(!created) throw new NotCreatedError("TRANSACTION");

        return created;
    }

    public async delete(projectId: number, cashboxId: number, id: number, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:delete');

        const exist = await this.repo.findFirstByFilter({cashboxId, id});
        if(!exist) throw new NotFoundError("TRANSACTION");

        const deletedData = {
            isDeleted: true
        };

        const deleted = await this.repo.softDelete(id, deletedData);
        if(!deleted) throw new NotDeletedError("TRANSACTION");

        await this.cashe.del(`project:${projectId}`);

        return deleted;
    }
}