import { AlreadyExistError, NotCreatedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserEntity } from "../../../../auth/src/modules/user/entities/User";
import { BudgetRepository } from "./repository";
import { ProjectService } from "../project/services";
import { createData } from "./types";
import { DecimalClass as Decimal } from "@shared-types/index.ts";

export class BudgetService {
    constructor (
        private repo: BudgetRepository,
        private projectService: ProjectService
    ) {}

    public async getById(id: number, user: UserEntity, cashboxId: number, projectId: number) {
        await this.projectService.authorize(projectId, user, 'cashbox:read')

        const filter = {
            id,
            cashboxId,
            cashbox: {
                projectId
            },
            isActive: true,
        }

        const budget = await this.repo.findDetailed(filter);
        if(!budget) throw new NotFoundError("BUDGET");

        return budget;
    }

    public async getActive(cashboxId: number, user: UserEntity, projectId: number) {
        await this.projectService.authorize(projectId, user, 'cashbox:read')

        const filter = {
            cashboxId,
            cashbox: {
                projectId
            },
            isActive: true,
        }

        const budget = await this.repo.findFirst(filter);
        if(!budget) throw new NotFoundError("BUDGET");

        return budget;
    }

    public async getHistory(cashboxId: number, user: UserEntity, projectId: number) {
        await this.projectService.authorize(projectId, user, 'cashbox:read')
        
        const filter = {
            cashboxId,
            cashbox: {
                projectId
            }
        }
        const orderBy = {
            startDate: 'desc'
        }

        const budgets = await this.repo.findByFilter(filter, {}, orderBy);

        return budgets.map(i => i.response())
    }

    public async create(user: UserEntity, data: any, cashboxId: number, projectId: number) {
        await this.projectService.authorize(projectId, user, ["cashbox:read", 'budget:create'], "all");
        
        const filter = {
            cashboxId,
            cashbox: { projectId },
            isActive: true,
            startDate: { lte: data.endDate },
            endDate: { gte: data.startDate } 
        }

        const exist = await this.repo.findFirst(filter);
        if(exist) throw new AlreadyExistError("BUDGET");

        const createData: createData = {
            title: data.title || "",
            description: data.description || "",
            cashboxId,
            amount: new Decimal(data.amount ?? 0),
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            isActive: true
        }
        
        const budget = await this.repo.create(createData);
        if(!budget) throw new NotCreatedError("BUDGET");

        return budget;
    }

    public async update(id: number, user: UserEntity, data: any, cashboxId: number, projectId: number) {
        await this.projectService.authorize(projectId, user, ['cashbox:read', 'budget:update'], 'all')

        const budget = await this.getById(id, user, cashboxId, projectId);
        const updateData = budget.update(data);

        const updated = await this.repo.update(id, updateData);
        if(!updated) throw new NotUpdatedError("BUDGET");

        return updated;
    }
}