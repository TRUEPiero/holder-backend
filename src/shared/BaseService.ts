import { PrismaClient } from "@prisma/client";
import type { PaginationParam, PrismaModelName, QueryParam } from "../types/type";
import { FilterBuilder } from "./FilterBuilder";

const prisma = new PrismaClient();
const FilterBuild = new FilterBuilder();

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

    async getWithPagination(
        parameters: PaginationParam
    ) {
        const { page, limit, name, sortBy = 'id', sortOrder = 'asc', include = "{}", textCheck = "{}", fieldIn = "{}", fieldFilter = "{}" } = JSON.parse(JSON.stringify(parameters));

        const isLimitsNotValid =
            page === undefined ||
            limit === undefined ||
            page === null ||
            limit === null;

        const where = FilterBuild.buildFilterWhere(name, JSON.parse(textCheck), JSON.parse(fieldFilter), JSON.parse(fieldIn));
        const orderBy = FilterBuild.buildFilterOrder(sortBy, sortOrder);

        // Простой случай: без пагинации
        if (isLimitsNotValid) {
            return {
                data: await this.getAllWithQuery({where, orderBy})
            };
        }

        // Валидация
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
                include: JSON.parse(include)
            }),
            (this.model as any).count({where}),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: items || [],
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNextPage: page < totalPages,
            },
        };
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