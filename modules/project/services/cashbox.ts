import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export class CashboxService {
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
