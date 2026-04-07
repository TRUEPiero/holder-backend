import { DirectoryService } from "@shared/DirectoryService";
import { CashboxEntity } from "./entities/Cashbox";
import type { Cashbox } from "./types";


export class CashboxRepository {
    constructor(private base: DirectoryService<'cashbox'>) {}

    async findById(id: number): Promise<CashboxEntity | null> {
        const data = await this.base.getById(id);
        return data ? new CashboxEntity(data) : null;
    }

    async findProjectCashboxes(projectId: number): Promise<CashboxEntity[]> {
        const data = await this.base.getByFields({ projectId });
        return data.map((p: Cashbox) => new CashboxEntity(p));
    }

    async findDetailedCashbox(id: number) {
        const data = await this.base.getFirstByFields(
            { id },
            {
                transactions: true
            }
        );

        return new CashboxEntity(data);
    }

    async create(data: any): Promise<CashboxEntity> {
        const created = await this.base.createItem(data);
        return new CashboxEntity(created);
    }

    async update(id: number, data: any): Promise<CashboxEntity> {
        const updated = await this.base.updateItem(id, data);
        return new CashboxEntity(updated);
    }

    async delete(id: number) {
        const project = await this.base.deleteItem(id);

        return new CashboxEntity(project);
    }
}