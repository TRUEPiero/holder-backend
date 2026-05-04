import db from "@common/prisma";
import { Money } from "../../cashbox/entities/Money";
import { ProjectService } from "../../project/services";
import { UserEntity } from "../../../../../auth/src/modules/user/entities/User";
import { PrismaTxClient } from "@shared-types/index.ts";
import { ParamsBetween, ParamsExternal, TransactionTypes } from "../types";
import { NotFoundError } from "@common/errors";
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

            await tx.transaction.create({
                data: {
                    cashboxId: request.to,
                    type: "income",
                    amount: amount.get(),
                    authorId: user.id,
                    tags: this.connectOrCreate(request.tags)
                }
            })

            await tx.transaction.create({
                data: {
                    cashboxId,
                    type: "expense",
                    amount: amount.get(),
                    authorId: user.id,
                    tags: this.connectOrCreate(request.tags)
                }
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

            await tx.transaction.create({
                data: {
                    cashboxId,
                    type: transactionType,
                    amount: amount.get(),
                    authorId: user.id,
                    tags: this.connectOrCreate(request.tags)
                }
            });

            await this.cashe.del(`project:${projectId}`)

            return true;
        });
    }

    private connectOrCreate(tags?: {id?: number, title?: string}[]) {
        return {
            connect: tags
                ?.filter(t => t.id)
                .map(t => ({ id: t.id! })) ?? [],

            create: tags
                ?.filter(t => !t.id && t.title)
                .map(t => ({ title: t.title! })) ?? [],
        }
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