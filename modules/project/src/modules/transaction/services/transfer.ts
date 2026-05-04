import db from "@common/prisma";
import { Money } from "../../cashbox/entities/Money";
import { ProjectService } from "../../project/services";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { PrismaTxClient } from "@shared-types/index.ts";
import { ParamsBetween, ParamsExternal, TransactionTag, TransactionTypes } from "../types";
import { NotCreatedError, NotFoundError } from "@common/errors";
import { SameIdError } from "../errors";
import { CasheService } from "@services/CasheService";

export class TransferService {

    constructor(
        private cashe: CasheService,
        private projectService: ProjectService,
    ) { }

    public async transferMoneyBetweenCashbox(projectId: number, cashboxId: number, request: ParamsBetween, user: UserEntity) {
        const amount = new Money(request.amount);

        return await this.execute(projectId, user, async (tx) => {
            if (cashboxId === request.to) throw new SameIdError();

            const debitResult = await tx.cashbox.updateMany({
                where: {
                    id: cashboxId,
                    projectId,
                    balance: {
                        gte: amount.get()
                    }
                },
                data: {
                    balance: {
                        decrement: amount.get()
                    }
                }
            });
            if (debitResult.count !== 1) throw new NotFoundError('CASHBOX')

            const creditResult = await tx.cashbox.updateMany({
                where: {
                    id: request.to,
                    projectId
                },
                data: {
                    balance: {
                        increment: amount.get()
                    }
                }
            });
            if (creditResult.count !== 1) throw new NotFoundError('CASHBOX');

            const tag = await this.getFirstTagOrCreate(tx, request.tag);

            await tx.transaction.createManyAndReturn({
                data: [
                    {
                        cashboxId,
                        type: "expense",
                        amount: amount.get(),
                        authorId: user.id,
                        tagId: tag?.id
                    },
                    {
                        cashboxId: request.to,
                        type: "income",
                        amount: amount.get(),
                        authorId: user.id,
                        tagId: tag?.id
                    }
                ]
            })

            await this.cashe.del(`project:${projectId}`)

            return true;
        })
    }

    public async transferWithExternal(projectId: number, cashboxId: number, request: ParamsExternal, user: UserEntity) {
        const amount = new Money(request.amount);
        const transactionType = request.type as TransactionTypes;

        return await this.execute(projectId, user, async (tx) => {
            if (transactionType === 'income') {
                const updated = await tx.cashbox.updateMany({
                    where: {
                        id: cashboxId,
                        projectId
                    },
                    data: {
                        balance: {
                            increment: amount.get()
                        }
                    }
                });

                if (updated.count !== 1) throw new NotFoundError('CASHBOX');
            }

            if (transactionType === 'expense') {
                const updated = await tx.cashbox.updateMany({
                    where: {
                        id: cashboxId,
                        projectId,
                        balance: {
                            gte: amount.get()
                        }
                    },
                    data: {
                        balance: {
                            decrement: amount.get()
                        }
                    }
                });

                if (updated.count !== 1) throw new NotFoundError('CASHBOX_OR_NOT_ENOUGH_BALANCE');
            }

            const tag = await this.getFirstTagOrCreate(tx, request.tag);

            await tx.transaction.create({
                data: {
                    cashboxId,
                    type: transactionType,
                    amount: amount.get(),
                    authorId: user.id,
                    tagId: tag?.id
                }
            });

            await this.cashe.del(`project:${projectId}`)

            return true;
        });
    }

    private async getFirstTagOrCreate(tx: PrismaTxClient, tag?: TransactionTag) {
        if(!tag) return;

        const exist = await tx.transactionTag.findFirst({
            where: {
                OR: [
                    {id: tag.id},
                    {title: tag.title}
                ]
            }
        })
        if(exist) return exist;

        if(!tag.title) throw new Error("Error while adding tag.");

        const created = await tx.transactionTag.create({
            data: {
                title: tag.title
            }
        })

        if(!created) throw new NotCreatedError('TRANSACTION TAG');
        return created;
    }

    private async execute(
        projectId: number,
        user: UserEntity,
        hadler: (tx: PrismaTxClient) => Promise<any>
    ) {
        await this.projectService.authorize(projectId, user, 'transaction:create');

        return db.$transaction(hadler);
    }
}