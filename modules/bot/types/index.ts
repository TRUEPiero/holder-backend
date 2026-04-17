import { MemberRole, TransactionType } from "@prisma/client"

type EntityType = "project" | "cashbox" | "transaction" | "member"
type EntityData = any
type MemberRoles = MemberRole;
type TransactionTypes = TransactionType;

type Step = {
    entity?: EntityType,
    type: string,
    id?: number | null
}

type PaginationItem = {
    id: number,
    title?:  string,
    createdAt: Date,
}

type EntityHandler = {
    service: any,
    filter: any
    customFields: any[],
    menu: {
        list: (entity: EntityType, filter: any, limit?: number, page?: number) => Promise<any>,
        item: (item?: any) => any
    }
}

type EntityListFlags = {
    excludeId?: number | string;
    withBackButton?: boolean;
    isTransaction?: boolean;
    isMember?: boolean
};

type EntityListOptions = {
    page?: number,
    limit?: number,
}

export {
    EntityType,
    EntityData,
    EntityHandler,
    PaginationItem,
    EntityListFlags,
    EntityListOptions,
    Step,
    MemberRoles,
    TransactionTypes
}