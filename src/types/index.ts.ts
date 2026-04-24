import db from "@common/prisma";
import { Decimal } from "@prisma/client/runtime/library";

type PrismaModelName = keyof typeof db;
type PrismaTxClient = Omit<typeof db, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;
type DecimalType = Decimal;
const DecimalClass = Decimal

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

export type {
    PrismaModelName,
    PrismaTxClient,
    DecimalType,
    QueryParam,
    PaginationParam
}

export {
    DecimalClass
}