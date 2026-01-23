import { PrismaClient } from "@prisma/client";
import { DirectoryService } from "@shared/DirectoryService";
import { CashboxService } from "./cashbox";

const db = new PrismaClient();
const cashboxService = new CashboxService();

export class TransactionService extends DirectoryService<'transaction'> {

    constructor() {
        super('transaction', ['cashbox'])
    }

    public async getTransactions(projectId: number, cashboxId: number) {
        return await this.getByFields({
            AND: [
                {cashboxId},
                {cashbox: {
                    projectId
                }}
            ]
        })
    }

    public async moneyTransfer(projectId: number, cashboxId: number, request: any, user: any) {

        const cashboxes = await Promise.all([
            cashboxService.getById(cashboxId),
            cashboxService.getById(request.to),
        ])

        if(cashboxes.length < 2) return false

        const transfer = await db.$transaction(async () => {
            //Откуда
            const from = await cashboxService.updateByFields(
                {id: cashboxId},
                {
                    balance: {
                        decrement: request.amount
                    }
                }
            )

            if(from.data.balance.toNumber() < 0) {
                throw new Error(`Error`)
            }
            //Куда
            const to = await cashboxService.updateByFields(
                {id: request.to},
                {
                    balance: {
                        increment: request.amount
                    } 
            })

            return [from, to]
        })

        if(transfer.length < 2) return false

        const transactions = await db.$transaction([
            db.transaction.create({
                data: {
                    cashboxId,
                    type: "expense",
                    amount: request.amount,
                    authorId: user.id
                }
                
            }),
            db.transaction.create({
                data: {
                    cashboxId,
                    type: "income",
                    amount: request.amount,
                    authorId: user.id
                }
                
            }),
        ])

        if(transactions.length < 2) return false

        return true;
    }
}