import db from "@common/prisma";
import { Money } from "../../cashbox/entities/Money";
import { TransactionRepository } from "../repository";
import { CashboxService } from "../../cashbox/services";
import { ProjectService } from "../../project/services";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { PrismaTxClient } from "@shared-types/index.ts";
import { TransactionTypes } from "../types";
import { AccessDeniedError, NotFoundError } from "@common/errors";
import { SameIdError, SameProjectError } from "../errors";

type ParamsBetween = {
    amount: number,
    to: number,
}

type ParamsExternal = {
    amount: number,
    type: TransactionTypes
}

export class TransferService {

    constructor(
        private cashboxService: CashboxService,
        private transactionRepo: TransactionRepository,
        private projectService: ProjectService,
    ) {}

    public async transferMoneyBetweenCashbox(projectId: number, cashboxId: number, request: ParamsBetween, user: any) {      
        
        const amount = new Money(request.amount);
        
        return await this.execute(projectId, user, async (tx) => {
            if(cashboxId === request.to) throw new SameIdError();

            const [from, to] = await Promise.all([
                this.cashboxService.getById(cashboxId),
                this.cashboxService.getById(request.to)
            ]);

            if(!from || !to) throw new NotFoundError('CASHBOX');
            if(from.projectId !== to.projectId ) throw new SameProjectError();

            from.debit(amount);
            to.credit(amount)

            await Promise.all([
                tx.cashbox.update({ where: { id: from.id }, data: { balance: from.balance } }),
                tx.cashbox.update({ where: { id: to.id }, data: { balance: to.balance } }),
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

    public async transferWithExternal(projectId: number, cashboxId: number, request: ParamsExternal, user: any) {
        
        const amount = new Money(request.amount);

        return await this.execute(projectId, user, async(tx) => {
            const transactionType = request.type as TransactionTypes;

            const cashbox = await this.cashboxService.getById(cashboxId);

            transactionType === 'income' ? cashbox.credit(amount) : cashbox.debit(amount);
            
            await Promise.all([
                tx.cashbox.update({ where: { id: cashbox.id }, data: { balance: cashbox.balance } }),
                tx.transaction.create({
                    data: {
                        cashboxId: cashbox.id,
                        type: transactionType,
                        amount: amount.get(),
                        authorId: user.id
                    }
                })
            ])

            return true;
        })
    }

    private async execute(
        projectId: number, 
        user: UserEntity,
        hadler: (tx: PrismaTxClient) => Promise<any>
    ) {
        await this.projectService.checkAccess(projectId, user);

        return db.$transaction(hadler);
    }
}