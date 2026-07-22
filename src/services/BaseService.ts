import type { PaginationParam, PrismaModelName, PrismaTxClient, QueryParam } from "../types/index";
import { FilterBuilder } from "../builders/FilterBuilder.js";
import db from "@common/prisma";

const FilterBuild = new FilterBuilder();

export class BaseService<ModelName extends PrismaModelName> {
    public readonly model: any

    constructor(
        public modelName: ModelName,
        public client?: typeof db | PrismaTxClient
    ) {
        this.client = client ?? db
        this.model = this.client[modelName]
    }

    public async createItem(data: any) {
        return await (this.model as any).create({ data }) || null;
    }

    public async getAll(): Promise<any[]> {
        return await (this.model as any).findMany() || [];
    }
    
    public async getAllWithQuery(
        query: QueryParam = {}
    ): Promise<any[]> {
        return await (this.model as any).findMany(query) || []
    }

    public async getById(id: number): Promise<any | null> {
        return await (this.model as any).findUnique({where: {id}}) || null;
    }

    public async getByFields(
        fields: any, 
        include: any = {}, 
        orderBy: any = {}
    ): Promise<any[]> {
        return await (this.model as any).findMany({where: {...fields}, include, orderBy}) || [];
    }

    public async getFirstByFields(
        fields: any, 
        include: any = {}
    ): Promise<any | null> {
        return await (this.model as any).findFirst({where: {...fields}, include}) || null;
    }

    public async getWithPagination(
        parameters: PaginationParam
    ) {
        const { page, limit, name, sortBy = 'id', sortOrder = 'asc', include = {}, textCheck = {}, fieldIn = {}, fieldFilter = {} } = JSON.parse(JSON.stringify(parameters));

        const isLimitsNotValid =
            page === undefined ||
            limit === undefined ||
            page === null ||
            limit === null;

        const where = FilterBuild.buildFilterWhere(name, textCheck, fieldFilter, fieldIn);
        const orderBy = FilterBuild.buildFilterOrder(sortBy, sortOrder);

        if (isLimitsNotValid) {
            const items = await this.getAllWithQuery({where, orderBy});
            return {items, currentPage: page, totalPages: 0, totalItems: 0, hasNextPage: false}
        }

        if (page < 1 || limit < 1) {
            throw new Error('Page or Limit is incorrect');
        }

        const skip = (page - 1) * limit;

        const [items, totalItems] = await Promise.all([
            (this.model as any).findMany({
                skip,
                take: limit,
                where,
                orderBy,
                include: include
            }) || [],
            (this.model as any).count({where}),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {items, currentPage: page, totalPages, totalItems, hasNextPage: page < totalPages};
    }

    public async updateItem(
        id: number,
        data: any
    ): Promise<any | null> {
        const item = await (this.model as any).update({where: {id}, data})

        return item || null
    }

    public async updateByFields(
        fields: any,
        data: any
    ): Promise<any[]> {
        return await (this.model as any).updateManyAndReturn({where: {...fields}, data}) || []
    }

    public async updateFirstByFields(
        fields: any,
        data: any
    ): Promise<any> {
        const finded = await (this.model as any).findFirst({
            where: {...fields}
        });
        if(!finded) return null;

        return await (this.model as any).update({where: {id: finded.id}, data}) || []
    }

    public async upsert(
        filter: any,
        create: any,
        update: any,
        include: any = {}
    ): Promise<any> {
        return await (this.model as any).upsert({
            where: {
                ...filter
            },
            create,
            update
        })
    }

    public async deleteItem(id: number): Promise<any | null> {
        return await (this.model as any).delete({where: { id }}) || {}
    }

    public async deleteByFields(fields: any): Promise<any[]> {
        return await (this.model as any).deleteMany({where: {...fields}}) || [];
    }
}