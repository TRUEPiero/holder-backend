import type { PaginationParam, PrismaModelName, PrismaTxClient, QueryParam } from "../types/type";
import { FilterBuilder } from "./FilterBuilder";
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

    public async getAll() {
        return await (this.model as any).findMany() || [];
    }
    
    public async getAllWithQuery(
        query: QueryParam = {}
    ) {
        return await (this.model as any).findMany(query) || []
    }

    public async getById(id: number) {
        return await (this.model as any).findUnique({where: {id}}) || null;
    }

    public async getByFields(
        fields: any, 
        include: any = {}, 
        orderBy: any = {}
    ) {
        return await (this.model as any).findMany({where: {...fields}, include, orderBy}) || [];
    }

    public async getFirstByFields(
        fields: any, 
        include: any = {}
    ) {
        return await (this.model as any).findFirst({where: {...fields}, include}) || null;
    }

    public async getWithPagination(
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

        if (isLimitsNotValid) {
            return await this.getAllWithQuery({where, orderBy});
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
                include: JSON.parse(include)
            }) || [],
            (this.model as any).count({where}),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {items, currentPage: page, totalPages, totalItems, hasNextPage: page < totalPages};
    }

    public async updateItem(
        id: number,
        data: any
    ) {
        const item = await (this.model as any).update({where: {id}, data})

        if(!item) throw new Error('Wrong ID'); 

        return item || null
    }

    public async updateByFields(
        fields: any,
        data: any
    ) {
        return await (this.model as any).updateMany({where: {...fields}, data}) || []
    }

    public async deleteItem(id: number) {
        return await (this.model as any).delete({where: { id }}) || {}
    }

    public async deleteByFields(fields: any) {
        return await (this.model as any).deleteMany({where: {...fields}}) || [];
    }
}