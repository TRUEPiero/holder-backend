import db from "@common/prisma";

type PrismaModelName = keyof typeof db;
type PrismaTxClient = Omit<typeof db, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">;

type QueryParam = {
    where?: Record<string, any>,
    orderBy?: Record<string , 'asc' | 'desc'>,
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
    fieldFilter?: string 
}

export type {
    PrismaModelName,
    PrismaTxClient,
    QueryParam,
    PaginationParam
}