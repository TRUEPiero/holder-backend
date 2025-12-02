import { PrismaClient } from "@prisma/client";
import { DirectoryService } from "@shared/DirectoryService";

const db = new PrismaClient();

export class CashboxService extends DirectoryService<'cashbox'>{

    constructor() {
        super('cashbox', [])
    }

    async getProjectCashboxes(projectId: number) {
        const cashboxes = await db.cashbox.findMany({
            where: {
                projectId
            }
        })

        return cashboxes;
    }

    async createCashbox(projectId: number, body: any) {
        const cashbox = await db.cashbox.create({
            data: {
                title: body.title,
                projectId
            }
        })

        return cashbox
    }
}
