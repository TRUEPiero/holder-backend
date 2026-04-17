import { TransactionType } from '@prisma/client';
import {t} from 'elysia';

type Transaction = {
    id: number;
    amount: number;
    description: string;
    type: string;
    tags: any[];
    author: any;
    cashbox: any;
    createdAt: Date;
}

type TransactionTypes = TransactionType

type CreateData = {
    amount: number;
    description?: string;
    type: string;
    tags?: any[];
    author?: any;
    cashbox?: any;
}

const ResponseTransaction = t.Object({
    id: t.Number(),
    amount: t.Any(),
    description: t.Nullable(t.String()),
    tags: t.Array(t.Any()),
    cashboxId: t.Number()
})

const ResponseObject = t.Object({
    data: t.Nullable(ResponseTransaction)
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseTransaction)
})

export type {
    Transaction,
    TransactionTypes,
    CreateData,
}

export {
    ResponseTransaction,
    ResponseObject,
    ResponseObjects,
}