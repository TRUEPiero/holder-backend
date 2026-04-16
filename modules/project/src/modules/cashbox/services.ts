import { ProjectService } from "../project/services";
import { CashboxRepository } from "./repository";

export class CashboxService{

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
        const cashbox = await this.repo.findDetailed(id);
        if(!cashbox) throw new Error("CASHBOX_NOT_FOUND");
        return cashbox;
    }

    public async getByProject(projectId: number) {
        return await this.repo.findByProject(projectId);
    }

    public async getWithPagination(parameters: any) {
        const cashbox = await this.repo.findWithPagination(parameters);
        return cashbox;
    }

    public async create(projectId: number, body: any, user: any) {
        const project = await this.projectService.getById(projectId);
        
        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        return this.repo.create({ projectId, ...body });
    }

    public async update(projectId: number, id: number, data: any, user: any) {
        const project = await this.projectService.getById(projectId);
        
        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        const cashbox = await this.getById(id);
        const updated = cashbox.update(data);
        return this.repo.update(id, updated);
    }

    public async delete(projectId: number, id: number, user: any) {
        const project = await this.projectService.getById(projectId);
        
        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        await this.getById(id); 
        return await this.repo.delete(id);
    }
}
