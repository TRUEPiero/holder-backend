import { CashboxRepository } from "./repository";

export class CashboxService{

    constructor(private repo: CashboxRepository) {}

    public async getById(id: number) {
        const cashbox = await this.repo.findById(id);
        if (!cashbox) throw new Error("CASHBOX_NOT_FOUND");
        return cashbox;
    }

    public async getDetail(id: number) {
        const cashbox = await this.repo.findDetailedCashbox(id);
        if(!cashbox) throw new Error("CASHBOX_NOT_FOUND");
        return cashbox;
    }

    public async getByProject(projectId: number) {
        return await this.repo.findProjectCashboxes(projectId);
    }

    public async getWithPagination(parameters: any) {
        const cashbox = await this.repo.findWithPagination(parameters);
        return cashbox;
    }

    public async create(projectId: number, body: any) {
        return this.repo.create({ projectId, ...body });
    }

    public async update(id: number, data: any) {
        await this.getById(id);
        return this.repo.update(id, {...data, balance: undefined});
    }

    public async updateBalance(id: number, amount: number) {
        await this.getById(id);
        return this.repo.update(id, {balance: amount});
    }

    public async delete(id: number) {
        await this.getById(id); 
        return await this.repo.delete(id);
    }
}
