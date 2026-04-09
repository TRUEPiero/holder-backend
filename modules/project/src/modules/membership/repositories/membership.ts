import { DirectoryService } from "@shared/DirectoryService";
import { MembershipEntity } from "../entities/membership";

export class MembershipRepository {
    constructor(private base: DirectoryService<'projectMembership'>) {}

    
    public async getMembership(id: number) {
        const data = await this.base.getById(id);
        return new MembershipEntity(data);        
    }

    public async getMembershipByFilter(filter: any) {
        const data = await this.base.getFirstByFields(filter);
        return new MembershipEntity(data);
    }

    public async create(data: any) {
        const created = await this.base.createItem(data);
        return new MembershipEntity(created);
    }
}