import { DirectoryService } from "@services/DirectoryService";


export class MemberRoleRepository {
    constructor(private base: DirectoryService<'memberRole'>) { }

    public async findByFilter(filter: any, include: any = {}) {
        const data = await this.base.getFirstByFields(filter, include);
        if (!data) return null;
        return data;
    }
}