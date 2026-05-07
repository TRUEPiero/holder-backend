import { TransactionType } from '@prisma/client';
import {t} from 'elysia';

type TransactionTypes = TransactionType

type Query = {
    tags?: number[]
}

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

type TransactionTag = {
    id?: number,
    title?: string
}

type CreateData = {
    amount: number;
    description?: string;
    type: string;
    tags?: TransactionTag[];
    author?: any;
    cashbox?: any;
}

type SoftDeleteData = {
    isDeleted: boolean
}

type ParamsBetween = {
    amount: number,
    to: number,
    tag?: {
        id?: number
        title?: string
    }
}

type ParamsExternal = {
    amount: number,
    type: TransactionTypes
    tag?: {
        id?: number
        title?: string
    }
}

const TypesUnion = t.Union([
    t.Literal("income"),
    t.Literal("expense")
]);

const transaction = t.Object({
    id: t.Number(),
    amount: t.Any(),
    description: t.Nullable(t.String()),
    tagId: t.Number(),
})

const Tag = t.Object({
    id: t.Optional(t.Number()),
    title: t.Optional(t.String({
        minLength: 1
    })),
    transactions: t.Optional(
        t.Array(transaction)
    ),
    amount: t.Optional(t.Any())
})

const TransactionDetail = t.Object({
    id: t.Number(),
    amount: t.Any(),
    description: t.Nullable(t.String()),
    tag: t.Nullable(Tag),
    cashboxId: t.Number(),
    authorId: t.Number()
})

const ResponseTag = t.Object({
    data: t.Nullable(Tag)
})

const ResponseTags = t.Object({
    data: t.Array(Tag)
})

const ResponseObject = t.Object({
    data: t.Nullable(TransactionDetail)
})

const ResponseObjects = t.Object({
    data: t.Array(TransactionDetail)
})

const ResponseGrouped = t.Object({
    data: t.Record(
        t.String(), t.Array(Tag)
    )
})

export type {
    Query,
    Transaction,
    TransactionTag,
    TransactionTypes,
    CreateData,
    SoftDeleteData,
    ParamsBetween,
    ParamsExternal,
}

export {
    Tag,
    TypesUnion,
    transaction,
    TransactionDetail,
    ResponseObject,
    ResponseObjects,
    ResponseTag,
    ResponseTags,
    ResponseGrouped
}