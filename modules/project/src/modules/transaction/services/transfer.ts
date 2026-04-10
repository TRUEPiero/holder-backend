import db from "@common/prisma";
import { Money } from "../../cashbox/entities/Money";
import { CashboxRepository } from "../../cashbox/repository";
import { TransactionRepository } from "../repository";

export class TransferService {

    constructor(
        private cashboxRepo: CashboxRepository,
        private transactionRepo: TransactionRepository
    ) {}

    public async transferMoneyBetweenCashbox(projectId: number, cashboxId: number, request: any, user: any) {
        const amount = new Money(request.amount)

        return await db.$transaction(async (tx) => {
            if(cashboxId === request.to) throw new Error('SAME_ID');

            const [from, to] = await Promise.all([
                this.cashboxRepo.findById(cashboxId),
                this.cashboxRepo.findById(request.to)
            ]);

            if(!from || !to) throw new Error('CASHBOX_NOT_FOUND');

            from.debit(amount);
            to.credit(amount)

            //Выполняется очень долго timeout 5s
            // await Promise.all([
            //     this.cashboxRepo.update(from.id, { balance: from.balance }),
            //     this.cashboxRepo.update(to.id, { balance: to.balance })
            // ]);
            await Promise.all([
                tx.cashbox.update({ where: { id: from.id }, data: { balance: from.balance } }),
                tx.cashbox.update({ where: { id: to.id }, data: { balance: to.balance } }),
            ]);

            //Выполняется очень долго timeout 5s
            // await Promise.all([
            //     this.transactionRepo.create({
            //         cashboxId: from.id,
            //         type: "expense",
            //         amount: amount.get(),
            //         authorId: user.id
            //     }),
            //     this.transactionRepo.create({
            //         cashboxId: to.id,
            //         type: "income",
            //         amount: amount.get(),
            //         authorId: user.id
            //     })
            // ])
            await Promise.all([
                tx.transaction.create({
                    data: {
                        cashboxId: from.id,
                        type: "expense",
                        amount: amount.get(),
                        authorId: user.id
                    }
                }),
                tx.transaction.create({
                    data: {
                        cashboxId: to.id,
                        type: "income",
                        amount: amount.get(),
                        authorId: user.id
                    }
                })
            ])
            

            return true;
        })        
    }
}