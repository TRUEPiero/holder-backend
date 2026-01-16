import { PrismaClient } from "@prisma/client";
import { DirectoryService } from "@shared/DirectoryService";
import { CashboxService } from "./cashbox";

const db = new PrismaClient();
const cashboxService = new CashboxService();

export class TransactionService extends DirectoryService<'transaction'> {

    constructor() {
        super('transaction', ['cashboxFrom', 'cashboxTo'])
    }

    public async moneyTransfer(projectId: number, cashboxId: number, request: any, user: any) {

        const cashboxes = await Promise.all([
            cashboxService.getById(cashboxId),
            cashboxService.getById(request.to),
        ])

        if(cashboxes.length < 2) return false

        const transfer = await db.$transaction([
            db.cashbox.update({
                where: {
                    id: cashboxId
                },
                data: {
                    amount: cashboxes[0].data.amount - request.amount
                }
            }),
            db.cashbox.update({
                where: {
                    id: request.to
                },
                data: {
                    amount: cashboxes[1].data.amount + request.amount 
                }
            })
        ])

        if(transfer.length < 2) return false

        const transaction = await this.createItem({
            cashboxFrom: cashboxId,
            cashboxTo: request.to,
            amount: request.amount,
            authorId: user.id
        });

        return transaction;
    }
}