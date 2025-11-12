import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PrismaModelName = keyof typeof prisma;

type QueryParam = {
    where?: Record<string, any>,
    orderBy?: Record<string , 'asc' | 'desc'>,
}

export type {
    PrismaModelName,
    QueryParam
}