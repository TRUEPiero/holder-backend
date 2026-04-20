import { DirectoryService } from "@shared/DirectoryService";
import { MemberEntity } from "../entities/membership";
import { Member } from "../types";

export class MembershipRepository {
    constructor(private base: DirectoryService<'projectMember'>) {}

    
    public async findById(id: number) {
        const include = {user: true};
        const data = await this.base.getFirstByFields(id, include);
        if(!data) return null;
        return new MemberEntity(data);        
    }

    public async findByFilter(filter: any) {
        const data = await this.base.getFirstByFields(filter);
        if(!data) return null;
        return new MemberEntity(data);
    }

    async findWithPagination(parameters: any) {
        const preparedParam = {
            ...parameters,
            include: {user: true}
        }

        const paginationData = await this.base.getWithPagination(preparedParam); 
        const { currentPage, totalPages, totalItems, hasNextPage } = paginationData;
        
        const items: MemberEntity[] = paginationData.items.map((p: Member) => new MemberEntity(p));
        
        return {
            items,
            pagination: {
                currentPage, 
                totalPages, 
                totalItems, 
                hasNextPage
            }
        }
    }

    public async create(data: any) {
        const created = await this.base.createItem(data);
        if(!created) return null;
        
        return new MemberEntity(created);
    }

    public async update(id: number, data: any) {
        const updated = await this.base.updateItem(id, data);
        if(!updated) return null;

        return new MemberEntity(updated);
    }
}