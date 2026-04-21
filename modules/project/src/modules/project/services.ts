import { PaginationParam } from "@shared-types/index.ts";
import { UserEntity } from "../../../../auth/src/modules/user/entities/User";
import { ProjectRepository } from "./repository";
import { SettingsOwner } from "../../interfaices/SettingsOwner";
import { SettingTargets } from "../settings/types";
import { CasheService } from "@services/CashService";
import { ProjectEntity } from "./entities/Project";

export class ProjectService implements SettingsOwner{

    constructor(
        private repo: ProjectRepository,
        private cashe: CasheService
    ) {}

    public async getById(id: number): Promise<ProjectEntity> {
        if(!id) throw new Error("ID_NOT_VALID");

        const cashed = await this.cashe.get(`project:${id}`)
        if(cashed) return new ProjectEntity(cashed);

        const project = await this.repo.findDetailedProject(id);
        if (!project) throw new Error("PROJECT_NOT_FOUND");

        await this.cashe.set(`project:${id}`, project.toJSON())

        return project;
    }

    public async getByUser(user: UserEntity): Promise<ProjectEntity[]> {
        return await this.repo.findUserProjects(user.id);
    }

    public async getWithPagination(parameters: PaginationParam) {
        const projects = await this.repo.findWithPagination(parameters);
        return projects;
    }

    public async create(user: UserEntity, body: any) {
        const createData = { 
            owner: user.id, 
            ...body,
            settings: body.settings ?? this.getDefaultSetting()
        };

        const created = await this.repo.create(createData);
        if(!created) throw new Error("PROJECT_NOT_CREATED");
        return created;
    }

    public async update(user: UserEntity, id: number, data: any) {
        const project = await this.getById(id);
        
        const access = project.checkAccess(user)
        if(!access) throw new Error('ACCESS_DENIED')

        const updated = project.update(data);

        const res = await this.repo.update(id, updated);
        if(!res) throw new Error("PROJECT_NOT_UPDATED");

        await this.cashe.del(`project:${id}`)

        return res
    }

    public async delete(user: UserEntity, id: number) {
        const project = await this.getById(id);

        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        const deleted = await this.repo.delete(id);
        if(!deleted) throw new Error("PROJECT_NOT_DELETED");

        await this.cashe.del(`project:${id}`)

        return deleted;
    }
    
    public getSettingTarget(): SettingTargets {
        return 'project'
    }

    private getDefaultSetting() {
        return [];
    }
}
