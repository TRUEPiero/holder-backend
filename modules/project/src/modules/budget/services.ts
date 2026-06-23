import { AlreadyExistError, InvalidFieldError, NotCreatedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { UserEntity } from "../../../../auth/src/modules/user/entities/User";
import { BudgetRepository } from "./repository";
import { ProjectService } from "../project/services";
import { createBody, createData, updateData } from "./types";
import { DecimalClass as Decimal } from "@shared-types/index";

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
        }

        const budget = await this.repo.findDetailed(filter);
        if(!budget) throw new NotFoundError("BUDGET");

        return budget;
    }

    public async getActive(cashboxId: number, user: UserEntity, projectId: number) {
        await this.projectService.authorize(projectId, user, 'cashbox:read')

        const now = new Date();

        const filter = {
            cashboxId,
            cashbox: {
                projectId
            },
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now }
        }

        return await this.repo.findFirst(filter);
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

    public async create(user: UserEntity, data: createBody, cashboxId: number, projectId: number) {
        await this.projectService.authorize(projectId, user, ["cashbox:read", 'budget:create'], "all");
        
        const { title, description, amount, startDate, endDate } = data;

        if(startDate.getTime() >= endDate.getTime() ) throw new InvalidFieldError("DATE");

        const filter = {
            cashboxId,
            cashbox: { projectId },
            isActive: true,
            startDate: { lt: endDate },
            endDate: { gt: startDate } 
        }

        const exist = await this.repo.findFirst(filter);
        if(exist) throw new AlreadyExistError("BUDGET");

        const createData: createData = {
            title: title || "",
            description: description || "",
            cashboxId,
            amount: new Decimal(amount ?? 0),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive: true
        }
        
        const budget = await this.repo.create(createData);
        if(!budget) throw new NotCreatedError("BUDGET");

        return budget;
    }

    public async update(id: number, user: UserEntity, data: updateData, cashboxId: number, projectId: number) {
        await this.projectService.authorize(projectId, user, ['cashbox:read', 'budget:update'], 'all')

        const budget = await this.getById(id, user, cashboxId, projectId);
        const updateData = budget.update(data);

        const updated = await this.repo.update(id, updateData);
        if(!updated) throw new NotUpdatedError("BUDGET");

        return updated;
    }
}