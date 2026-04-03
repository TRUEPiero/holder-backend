import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PrismaModelName = keyof typeof prisma;

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
    QueryParam,
    PaginationParam
}