import { PrismaClient } from "@prisma/client";
import type { PrismaModelName, QueryParam } from "../types/type";

const prisma = new PrismaClient();

export class BaseService<ModelName extends PrismaModelName> {
    protected readonly model: (typeof prisma)[ModelName]

    constructor(modelName: ModelName) {
        this.model = prisma[modelName]
    }

    async createItem(data: any) {
        const item = await (this.model as any).create({ data })
        return {data: item || null}
    }

    async getAll() {
        const items = await (this.model as any).findMany();
        return {data: items || []};
    }
    
    async getAllWithQuery(
        query: QueryParam = {}
    ) {
        const items = await (this.model as any).findMany(query)
        return {data: items || []}
    }

    async getById(id: number) {
        const item = await (this.model as any).findUnique({where: {id}});
        return {data: item || null};
    }

    async getByFields(
        fields: any, 
        include: any = {}, 
        orderBy: any = {}
    ) {
        const items = await (this.model as any).findMany({where: {...fields}, include, orderBy})
        return {data: items || []}
    }

    async getFirstByFields(
        fields: any, 
        include: any = {}
    ) {
        const item = await (this.model as any).findFirst({where: {...fields}, include});

        return {data: item || null}
    }

    async updateItem(
        id: number,
        data: any
    ) {
        const item = await (this.model as any).update({where: {id}, data})

        if(!item) throw new Error('Wrong ID'); 

        return {data: item || {}}
    }

    async updateByFields(
        fields: any,
        data: any
    ) {
        const items = await (this.model as any).updateMany({where: {...fields}, data})

        return {data: items || []}
    }

    async deleteItem(id: number) {
        const item = await (this.model as any).delete({where: { id }})
        
        if(!item) throw new Error('Wrong ID')
            
        return {data: item || null};
    }

    async deleteByFields(fields: any) {
        const items = await (this.model as any).deleteMany({where: {...fields}})

        return {data: items || []}
    }
}