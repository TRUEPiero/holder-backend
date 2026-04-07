import { CashboxRepository } from "./repository";

export class CashboxService{

    constructor(private repo: CashboxRepository) {}

    public async getCashbox(id: number) {
        const cashbox = await this.repo.findById(id);
        if (!cashbox) throw new Error("CASHBOX_NOT_FOUND");
        return cashbox;
    }

    public async getDetailCashbox(id: number) {
        const cashbox = await this.repo.findDetailedCashbox(id);
        if(!cashbox) throw new Error("CASHBOX_NOT_FOUND");
        return cashbox;
    }

    public async getProjectCashboxes(projectId: number) {
        return await this.repo.findProjectCashboxes(projectId);
    }

    public async createCashbox(projectId: number, body: any) {
        return this.repo.create({ projectId, ...body });
    }

    public async updateCashbox(id: number, data: any) {
        await this.getCashbox(id);
        return this.repo.update(id, data);
    }

    public async updateBalance(id: number, amount: number) {
        await this.getCashbox(id);
        return this.repo.update(id, {balance: amount});
    }

    public async deleteCashbox(id: number) {
        await this.getCashbox(id); 
        return await this.repo.delete(id);
    }
}
