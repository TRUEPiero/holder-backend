import {t} from 'elysia';

export type Transaction = {
    id: number;
    amount: number;
    description: string;
    type: string;
    tags: any[];
    author: any;
    cashbox: any;
    createdAt: Date;
}

export type CreateData = {
    amount: number;
    description?: string;
    type: string;
    tags?: any[];
    author?: any;
    cashbox?: any;
}

export const ResponseTransaction = t.Any({

})

export const ResponseObject = t.Record(
    t.String(), t.Nullable(ResponseTransaction)
)

export const ResponseObjects = t.Record(
    t.String(), t.Array(ResponseTransaction)
)