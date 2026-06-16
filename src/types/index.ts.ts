import db from "@common/prisma";
import { Decimal } from "@prisma/client/runtime/client";
import { Entity } from "../../modules/project/src/interfaces/Entity";
import { SettingTarget } from "@prisma/client";

type PrismaModelName = keyof typeof db;
type PrismaTxClient = Omit<typeof db, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;
type DecimalType = Decimal;
const DecimalClass = Decimal

type SettingTargets = SettingTarget

type QueryParam = {
    where?: Record<string, any>,
    orderBy?: Record<string , 'asc' | 'desc'>,
    include?: Record<string, any>
}

type PaginationParam = {
    page?: number | string, 
    limit?: number | string, 
    name?: string, 
    sortBy?: string, 
    sortOrder?: string, 
    include?: string, 
    textCheck?: string, 
    fieldIn?: string,
    fieldFilter?: any 
}

type PaginationResult = {
    items: Entity[];
    pagination: {
        currentPage: any;
        totalPages?: number;
        totalItems: any;
        hasNextPage?: boolean;
    };
}

export type {
    PrismaModelName,
    PrismaTxClient,
    DecimalType,
    QueryParam,
    PaginationParam,
    PaginationResult,
    SettingTargets
}

export {
    DecimalClass
}