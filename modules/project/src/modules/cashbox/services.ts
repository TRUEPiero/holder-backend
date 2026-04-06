import { DirectoryService } from "@shared/DirectoryService";
import { ProjectService } from "../project/services";
import { CashboxEntity } from "./entities/Cashbox";
import type { Cashbox } from "./types";

const projectService = new ProjectService();

export class CashboxService extends DirectoryService<'cashbox'>{

    constructor() {
        super('cashbox', [])
    }

    public async getCashbox(cashboxId: number) {
        const data = (await this.getById(cashboxId)).data;
        if(!data) throw new Error("CASHBOX_UNDEFINED");  

        return new CashboxEntity(data)
    }

    public async getProjectCashboxes(projectId: number) {
        const data = (await this.getByFields({projectId})).data
        const cashboxes = data.map((c: Cashbox) => new CashboxEntity(c))

        return {data: cashboxes || []}
    }

    public async createCashbox(projectId: number, body: any) {

        const project = await projectService.getProject(projectId);
        if(!project) throw new Error('PROJECT_NOT_FOUND'); 

        const data = (await this.createItem({
            title: body.title,
            projectId
        })).data

        if(!data) throw new Error("CASHBOX_NOT_CREATED");

        const cashbox = new CashboxEntity(data);

        return {data: cashbox}
    }

    public async updateCashbox(cashboxId: number, body: any) {
        const cashboxExist = await this.getCashbox(cashboxId);

        if(!cashboxExist) throw new Error('CASHBOX_UNDEFINED');

        const data = (await this.updateItem(
            cashboxId,
            {
                ...body
            }
        )).data

        const cashbox = new CashboxEntity(data)
        return {data: cashbox}
    }

    public async updateBalance(id: number, amount: number) {
        const data = (await this.updateItem(id, {
            balance: amount
        })).data 

        const cashbox = new CashboxEntity(data);
        return {data: cashbox}
    }

    public async deleteCashbox(cashboxId: number) {
        const cashbox = await this.getCashbox(cashboxId);
        if(!cashbox) throw new Error('CASHBOX_UNDEFINED')

        return await this.deleteItem(cashboxId);
    }
}
