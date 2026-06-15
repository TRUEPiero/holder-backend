import { TransactionType } from "@prisma/client"

type EntityType = "project" | "cashbox" | "transaction" | "member"
type EntityData = any
type MemberRoles = {
    name: string,
    permissions: any[]
};
type TransactionTypes = TransactionType;
type EntityControllerParams = {
    service: any
    config: any
    keyboard: any
}

type StepTypes = 'page' | 'item' | 'settings' | 'start';

type Step = {
    entity?: EntityType,
    type: StepTypes,
    id?: number | null
}

type PaginationItem = {
    id: number,
    title:  string,
    createdAt: Date,
}


type EntityListFlags = {
    withBackButton?: boolean;
    isMember?: boolean;
    create?: boolean
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