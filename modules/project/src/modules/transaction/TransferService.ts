import db from "@common/prisma";
import { CashboxService } from "../cashbox/services";
import { TransactionService } from "./services";
import { Money } from "../cashbox/entities/Money";

const cashboxService = new CashboxService();
const transactionService = new TransactionService();

export class TransferService {

    public async moneyTransfer(projectId: number, cashboxId: number, request: any, user: any) {
        const amount = new Money(request.amount)

        const res = await db.$transaction(async () => {
            const from = await cashboxService.getCashbox(cashboxId);
            const to = await cashboxService.getCashbox(request.to);

            if(!from || !to) throw new Error('CASHBOXES');

            from.debit(amount);
            to.credit(amount)

            await cashboxService.updateCashbox(from.id, {balance: from.balance})
            await cashboxService.updateCashbox(to.id, {balance: to.balance})

            await transactionService.createTransaction({
                cashboxId: from.id,
                type: "expense",
                amount: amount.get(),
                authorId: user.id
            }),
            await transactionService.createTransaction({
                cashboxId: to.id,
                type: "income",
                amount: amount.get(),
                authorId: user.id
            } )            

            return true;
        })

        if(!res) throw new Error("NON");
        return true; 
    }
}