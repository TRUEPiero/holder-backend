import { MemberRole, TransactionType } from "@prisma/client"

type EntityType = "project" | "cashbox" | "transaction" | "member"
type EntityData = any
type MemberRoles = MemberRole;
type TransactionTypes = TransactionType;
type EntityControllerParams = {
    service: any
    config: any
    keyboard: any
}


type Step = {
    entity?: EntityType,
    type: string,
    id?: number | null
}

type PaginationItem = {
    id: number,
    title:  string,
    createdAt: Date,
}


type EntityListFlags = {
    withBackButton?: boolean;
    isMember?: boolean
};

export {
    EntityType,
    EntityControllerParams,
    EntityData,
    PaginationItem,
    EntityListFlags,
    Step,
    MemberRoles,
    TransactionTypes
}