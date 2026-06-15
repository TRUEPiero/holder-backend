import { NotFoundError } from "@common/errors";
import { MemberRoleRepository } from "../repositories/role";

export class MemberRoleService {
    constructor(
        private repo: MemberRoleRepository,
    ) {}

    public async getDefault() {
        const filter = {
            isDefault: true
        };

        const role = await this.repo.findByFilter(filter);
        if(!role) throw new NotFoundError("MEMBER");
        return role;
    }

    public async getDetail() {
        const filter = {};
        const include = {
            permissions: true
        }

        const role = await this.repo.findByFilter(filter, include);

        if(!role) throw new NotFoundError("MEMBER");
        return role;
    }
}