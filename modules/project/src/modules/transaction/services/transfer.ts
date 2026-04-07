import db from "@common/prisma";
import { Money } from "../../cashbox/entities/Money";
import { DirectoryService } from "@shared/DirectoryService";
import { CashboxRepository } from "../../cashbox/repository";
// import { TransactionRepository } from "../repository";

export class TransferService {

    public async moneyTransfer(projectId: number, cashboxId: number, request: any, user: any) {
        const amount = new Money(request.amount)

        return await db.$transaction(async (tx) => {
            if(cashboxId === request.to) throw new Error('SAME_ID');

            const cashboxBase = new DirectoryService<'cashbox'>('cashbox', [], tx)
            const cashboxRepo = new CashboxRepository(cashboxBase);

            // const transactionBase = new DirectoryService<'transaction'>('transaction', [])
            // const transactionRepo = new TransactionRepository(transactionBase)

            const [from, to] = await Promise.all([
                cashboxRepo.findById(cashboxId),
                cashboxRepo.findById(request.to)
            ]);

            if(!from || !to) throw new Error('CASHBOX_NOT_FOUND');

            from.debit(amount);
            to.credit(amount)

            //Выполняется очень долго timeout 5s
            // await Promise.all([
            //     cashboxRepo.update(from.id, { balance: from.balance }),
            //     cashboxRepo.update(to.id, { balance: to.balance })
            // ]);
            await Promise.all([
                tx.cashbox.update({ where: { id: from.id }, data: { balance: from.balance } }),
                tx.cashbox.update({ where: { id: to.id }, data: { balance: to.balance } }),
            ]);

            //Выполняется очень долго timeout 5s
            // await Promise.all([
            //     transactionRepo.create({
            //         cashboxId: from.id,
            //         type: "expense",
            //         amount: amount.get(),
            //         authorId: user.id
            //     }),
            //     transactionRepo.create({
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