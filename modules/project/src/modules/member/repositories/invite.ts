import { DirectoryService } from "@services/DirectoryService";
import { InviteEntity } from "../entities/Invite";

export class InviteRepository {
    constructor(private base: DirectoryService<'projectInvite'>) {}

    public async getByFilter(filter: any) {
        const data = await this.base.getFirstByFields(filter);
        if(!data) return null;
        return new InviteEntity(data);
    }

    public async create(data:any) {
        const created = await this.base.createItem(data);
        if(!created) return null;

        return new InviteEntity(created);   
    }

    public async update(filter: any, data: any) {
        const updated = await this.base.updateFirstByFields(filter, data);
        if(!updated) return null;
        
        return new InviteEntity(updated);
    }
}