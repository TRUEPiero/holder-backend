import { DirectoryService } from "@services/DirectoryService";
import { BudgetEntity } from "./entities/Budget";
import { createData, updateDataRepo } from "./types";

export class BudgetRepository {
    constructor(
        private base: DirectoryService<'cashboxBudget'>
    ) { }

    public async findFirst(filter: any): Promise<BudgetEntity | null> {
        const data = await this.base.getFirstByFields(filter);
        if (!data) return null;

        return new BudgetEntity(data);
    }

    public async findDetailed(filter: any): Promise<BudgetEntity | null> {
        const data = await this.base.getFirstByFields(
            filter,
        )

        if (!data) return null;

        return new BudgetEntity(data);
    }

    public async findByFilter(filter: any, include: any = {}, orderBy: any = {}): Promise<BudgetEntity[]> {
        const data = await this.base.getByFields(filter, include, orderBy);
        return data.map(i => new BudgetEntity(i));
    }

    public async create(data: createData): Promise<BudgetEntity | null> {
        const created = await this.base.createItem(data);
        if (!created) return null;
        return new BudgetEntity(created);
    }

    async update(id: number, data: updateDataRepo): Promise<BudgetEntity | null> {
        const updated = await this.base.updateItem(id, data);
        if (!updated) return null;
        return new BudgetEntity(updated);
    }
}