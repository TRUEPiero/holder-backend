import { PaginationParam } from "@shared-types/index.ts";
import { ProjectService } from "../../project/services";
import { TransactionRepository } from "../repositories/transaction";
import { CreateData, Query } from "../types";
import { InvalidFieldError, NotCreatedError, NotDeletedError, NotFoundError } from "@common/errors";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { DecimalClass as Decimal } from "@shared-types/index.ts";
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

    public async getGroupedByTags(projectId: number, cashboxId: number, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:read');
        
        const filter = {
            cashboxId,
            cashbox: {
                projectId
            },
        };
        const include = {
            tag: true
        }
        
        const transactions = await this.repo.findByFilter(filter, include);

        const result = {
            income: [] as any[],
            expense: [] as any[]
        }

        for(const type of ['income', 'expense'] as const) {
            const filtered = transactions.filter(i => i.getType() === type);

            const groupedByTag = Object.groupBy(filtered, item => {
                return item.getTag().title ?? 'other'
            });

            result[type] = Object.entries(groupedByTag).map(
                ([tagTitle, transactions]) => ({
                    id: transactions?.[0]?.getTag()?.id ?? null,
                    title: transactions?.[0]?.getTag()?.title ?? tagTitle,
                    transactions: transactions ?? [],
                    amount: transactions?.reduce((summ, transaction) => summ.plus(transaction.getAmount()), new Decimal(0))
                })
            );
        }

        return result;
    }

    public async getByFilter(projectId: number, cashboxId: number, query: Query, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:read');
        const filter = {
            cashboxId,
            cashbox: {
                projectId
            },
            tag: {
                in: query?.tags
            }
        }
        const include = {
            tag: true
        }

        const transaction = (await this.repo.findByFilter(filter, include)).map(i => i.response());
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
}