import db from "@common/prisma";
import { NotCreatedError, NotFoundError } from "@common/errors";
import { Money } from "../../cashbox/entities/Money";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { ProjectService } from "../../project/services";
import { DecimalType, PrismaTxClient } from "@shared-types/index.ts";
import { ParamsBetween, ParamsExternal, TransactionTag, TransactionTypes } from "../types";
import { AlreadyCalceledError, SameIdError } from "../errors";
import { CasheService } from "@services/CasheService";

type transactionData = {
    cashboxId: number
    tagId?: number | null
    authorId: number
    type: 'expense' | 'income'
    amount: DecimalType | number
    description?: string | null
}

export class TransferService {

    constructor(
        private projectService: ProjectService,
        private cashe: CasheService,
    ) { }

    public async transferMoneyBetweenCashbox(projectId: number, cashboxId: number, request: ParamsBetween, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:create');

        const amount = new Money(request.amount);

        return await this.execute(async (tx) => {
            if (cashboxId === request.to) throw new SameIdError();

            await this.decrementCashboxBalance(tx, cashboxId, projectId, amount.get());
            await this.incrementCashboxBalance(tx, request.to, projectId, amount.get());

            const tag = await this.getFirstTagOrCreate(tx, request.tag);

            const expenseData: transactionData = {
                cashboxId,
                type: "expense",
                amount: amount.get(),
                authorId: user.getId(),
                tagId: tag?.id
            }
            const expense = await this.createTransaction(tx, expenseData);

            const incomeData: transactionData = {
                cashboxId: request.to,
                type: "income",
                amount: amount.get(),
                authorId: user.getId(),
                tagId: tag?.id
            }
            const income = await this.createTransaction(tx, incomeData);

            await tx.transfer.create({
                data: {
                    expenseId: expense.id,
                    incomeId: income.id
                }
            })

            await this.cashe.del(`project:${projectId}`)

            return [expense, income];
        })
    }

    public async transferWithExternal(projectId: number, cashboxId: number, request: ParamsExternal, user: UserEntity) {
        await this.projectService.authorize(projectId, user, 'transaction:create');

        const amount = new Money(request.amount);
        const transactionType = request.type as TransactionTypes;

        return await this.execute(async (tx) => {
            if (transactionType === 'income')
                await this.incrementCashboxBalance(tx, cashboxId, projectId, amount.get());

            if (transactionType === 'expense')
                await this.decrementCashboxBalance(tx, cashboxId, projectId, amount.get());

            const tag = await this.getFirstTagOrCreate(tx, request.tag);

            const data: transactionData = {
                cashboxId,
                type: transactionType,
                amount: amount.get(),
                authorId: user.getId(),
                tagId: tag?.id
            }
            const transaction = await this.createTransaction(tx, data);

            await tx.transfer.create({
                data: {
                    expenseId: transaction.type === 'expense' ? transaction.id : null,
                    incomeId: transaction.type === 'income' ? transaction.id : null
                }
            })

            await this.cashe.del(`project:${projectId}`)

            return transaction;
        });
    }

    public async cancelTransaction(transactionId: number, user: UserEntity, cashboxId: number, projectId: number) {
        await this.projectService.authorize(projectId, user, 'transaction:delete');

        const transactions = await this.execute(async (tx) => {
            const transfer = await tx.transfer.findFirst({
                where: {
                    OR: [
                        {incomeId: transactionId},
                        {expenseId: transactionId}
                    ]
                },
                include: {
                    expense: true,
                    income: true
                }
            })
            if (!transfer) throw new NotFoundError('TRANSFER');

            if (
                transfer.cancelExpenseId ||
                transfer.cancelIncomeId ||
                transfer.cancelAt
            ) throw new AlreadyCalceledError();

            const { expense, income } = transfer;

            let cancelExpense = null;
            let cancelIncome = null;

            if (expense) {
                const data: transactionData = {
                    description: expense.description,
                    amount: expense.amount,
                    type: 'income',
                    authorId: expense.authorId,
                    cashboxId: expense.cashboxId,
                    tagId: expense.tagId
                }
                cancelExpense = await this.createTransaction(tx, data);

                await this.incrementCashboxBalance(tx, expense.cashboxId, projectId, expense.amount);

            }

            if (income) {
                const data: transactionData = {
                    description: income.description,
                    amount: income.amount,
                    type: 'expense',
                    authorId: income.authorId,
                    cashboxId: income.cashboxId,
                    tagId: income.tagId
                }
                cancelIncome = await this.createTransaction(tx, data);

                await this.decrementCashboxBalance(tx, income.cashboxId, projectId, income.amount);
            }

            await tx.transfer.update({
                where: {
                    id: transfer.id
                },
                data: {
                    cancelAt: new Date(),
                    cancelExpenseId: cancelExpense?.id,
                    cancelIncomeId: cancelIncome?.id
                }
            })

            await this.cashe.del(`project:${projectId}`)

            return [cancelExpense, cancelIncome];
        })

        return transactions.filter(Boolean)
    }

    private async getFirstTagOrCreate(tx: PrismaTxClient, tag?: TransactionTag) {
        if (!tag) return;

        const exist = await tx.transactionTag.findFirst({
            where: {
                OR: [
                    { id: tag.id },
                    { title: tag.title }
                ]
            }
        })
        if (exist) return exist;

        if (!tag.title) throw new Error("Error while adding tag.");

        const created = await tx.transactionTag.create({
            data: {
                title: tag.title
            }
        })

        if (!created) throw new NotCreatedError('TRANSACTION TAG');
        return created;
    }

    private async createTransaction(tx: PrismaTxClient, data: transactionData) {
        const transaction = await tx.transaction.create({
            data,
            include: {
                tag: true
            }
        })
        if (!transaction) throw new NotCreatedError('TRANSACTION');

        return transaction;
    }

    private async checkCashboxExist(tx: PrismaTxClient, id: number, projectId: number) {
        const exist = await tx.cashbox.findFirst({
            where: {
                id,
                projectId
            }
        });

        if (!exist) throw new NotFoundError('CASHBOX');
    }

    private async decrementCashboxBalance(tx: PrismaTxClient, id: number, projectId: number, amount: DecimalType | number) {
        await this.checkCashboxExist(tx, id, projectId);

        const cashbox = await tx.cashbox.update({
            where: {
                id,
                projectId
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        })

        return cashbox;
    }

    private async incrementCashboxBalance(tx: PrismaTxClient, id: number, projectId: number, amount: DecimalType | number) {
        await this.checkCashboxExist(tx, id, projectId);

        const cashbox = await tx.cashbox.update({
            where: {
                id,
                projectId
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        })

        return cashbox;
    }

    private async execute(hadler: (tx: PrismaTxClient) => Promise<any>) {
        return db.$transaction(hadler);
    }
}