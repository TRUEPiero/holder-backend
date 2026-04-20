import { PaginationParam } from "@shared-types/index.ts";
import { ProjectService } from "../project/services";
import { CashboxRepository } from "./repository";
import { SettingOwner } from "../../interfaices/SettingOwner";
import { SettingTargets } from "../settings/types";

export class CashboxService implements SettingOwner{

    constructor(
        private repo: CashboxRepository,
        private projectService: ProjectService
    ) {}

    public async getById(id: number) {
        if(!id) throw new Error("ID_NOT_VALID");
        
        const cashbox = await this.repo.findById(id);
        if (!cashbox) throw new Error("CASHBOX_NOT_FOUND");
        return cashbox;
    }

    public async getDetail(id: number) {
        if(!id) throw new Error("ID_NOT_VALID");

        const cashbox = await this.repo.findDetailed(id);
        if(!cashbox) throw new Error("CASHBOX_NOT_FOUND");
        return cashbox;
    }

    public async getByProject(projectId: number) {
        return await this.repo.findByProject(projectId);
    }

    public async getWithPagination(parameters: PaginationParam) {
        const cashbox = await this.repo.findWithPagination(parameters);
        return cashbox;
    }

    public async create(projectId: number, body: any, user: any) {
        const project = await this.projectService.getById(projectId);
        
        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        const created = await this.repo.create({ projectId, ...body });
        if(!created) throw new Error("CASHBOX_NOT_CREATED")
        return created;
    }

    public async update(projectId: number, id: number, data: any, user: any) {
        const project = await this.projectService.getById(projectId);
        
        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        const cashbox = await this.getById(id);
        const updated = cashbox.update(data);
        const res = await this.repo.update(id, updated);
        if(!res) throw new Error("CASHBOX_NOT_CREATED")
        return res;
    }

    public async delete(projectId: number, id: number, user: any) {
        const project = await this.projectService.getById(projectId);
        
        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        await this.getById(id); 
        const deleted = await this.repo.delete(id);
        if(!deleted) throw new Error("CASHBOX_NOT_CREATED")
        return deleted;
    }

    public getSettingTarget(): SettingTargets {
        return 'cashbox'
    }
}
