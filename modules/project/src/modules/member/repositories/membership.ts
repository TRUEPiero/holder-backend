import { DirectoryService } from "@shared/DirectoryService";
import { MemberEntity } from "../entities/membership";

export class MembershipRepository {
    constructor(private base: DirectoryService<'projectMember'>) {}

    
    public async findById(id: number) {
        const data = await this.base.getById(id);
        if(!data) return null;
        return new MemberEntity(data);        
    }

    public async findByFilter(filter: any) {
        const data = await this.base.getFirstByFields(filter);
        if(!data) return null;
        return new MemberEntity(data);
    }

    public async create(data: any) {
        const created = await this.base.createItem(data);
        return new MemberEntity(created);
    }

    public async update(id: number, data: any) {
        const updated = await this.base.updateItem(id, data);
        if(!updated) return null;

        return new MemberEntity(updated);
    }
}