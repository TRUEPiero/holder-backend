import { TransactionType } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export type EntityType = "project" | "cashbox" | "transaction" | "member"

export type Step = {
    entity?: EntityType,
    type: string,
    id?: number | null
}

export type EntityHandler = {
    service: any,
    filter: any
    customFields: any[],
    menu: {
        list: (entity: EntityType, filter: any, limit?: number, page?: number) => Promise<any>,
        item: (item?: any) => any
    }
}

export type PaginationItem = {
    id: number,
    title?:  string,
    amount?: Decimal,
    type?: TransactionType,
    createdAt: Date,
}

export type EntityListFlags = {
    excludeId?: number | string;
    withBackButton?: boolean;
    isTransaction?: boolean;
    isMember?: boolean
};

export type EntityListOptions = {
    page?: number,
    limit?: number,
}