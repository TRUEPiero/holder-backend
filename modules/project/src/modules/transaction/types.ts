import { TransactionType } from '@prisma/client';
import {t} from 'elysia';

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
    id: number,
    title: string
}

type TransactionTypes = TransactionType

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
    tags?: {
        id?: number
        title?: string
    }[]
}

type ParamsExternal = {
    amount: number,
    type: TransactionTypes
    tags?: {
        id?: number
        title?: string
    }[]
}

const ResponseTransaction = t.Object({
    id: t.Number(),
    amount: t.Any(),
    description: t.Nullable(t.String()),
    tags: t.Array(t.Any()),
    cashboxId: t.Number()
})

const Tag = t.Object({
    id: t.Optional(t.Number()),
    title: t.Optional(t.String())
})

const ResponseTag = t.Object({
    data: t.Nullable(Tag)
})

const ResponseTags = t.Object({
    data: t.Array(Tag)
})

const TypesUnion = t.Union([
    t.Literal("income"),
    t.Literal("expense")
]);

const ResponseObject = t.Object({
    data: t.Nullable(ResponseTransaction)
})

const ResponseObjects = t.Object({
    data: t.Array(ResponseTransaction)
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
    TypesUnion,
    ResponseTransaction,
    ResponseObject,
    ResponseObjects,
    Tag,
    ResponseTag,
    ResponseTags,
}