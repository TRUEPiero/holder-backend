import { PaginationParam } from "@shared-types/index.ts";
import { UserEntity } from "../../../../auth/src/modules/user/entities/User";
import { ProjectRepository } from "./repository";
import { SettingsOwner } from "../../interfaices/SettingsOwner";
import { SettingTargets } from "../settings/types";
import { CasheService } from "@services/CashService";
import { ProjectEntity } from "./entities/Project";
import { AccessDeniedError, InvalidFieldError, NotCreatedError, NotDeletedError, NotFoundError, NotUpdatedError } from "@common/errors";

export class ProjectService implements SettingsOwner{

    constructor(
        private repo: ProjectRepository,
        private cashe: CasheService
    ) {}

    public async checkAccess(id: number, user: UserEntity) {
        await this.getById(id, user);
    }

    public async getById(id: number, user: UserEntity): Promise<ProjectEntity> {
        if(!id) throw new InvalidFieldError('ID');

        let project: ProjectEntity | null = null;
        
        const cashed = await this.cashe.get(`project:${id}`)
        if(cashed) {
            project = new ProjectEntity(cashed);
        } else {
            const dbProject = await this.repo.findDetailedProject(id);
            if (!dbProject) throw new NotFoundError('PROJECT');

            project = dbProject;

            await this.cashe.set(`project:${id}`, project.toJSON())
        }

        const access = project.checkAccess(user);
        if (!access) throw new AccessDeniedError();

        return project;
    }

    public async getByUser(user: UserEntity): Promise<ProjectEntity[]> {
        return await this.repo.findUserProjects(user.id);
    }

    public async getWithPagination(parameters: PaginationParam) {
        return await this.repo.findWithPagination(parameters);
    }

    public async create(user: UserEntity, body: any) {
        const createData = { 
            owner: user.id, 
            ...body,
            settings: body.settings ?? this.getDefaultSetting()
        };

        const created = await this.repo.create(createData);
        if(!created) throw new NotCreatedError('PROJECT');
        return created;
    }

    public async update(user: UserEntity, id: number, data: any) {
        const project = await this.getById(id, user);

        const updated = project.update(data);

        const res = await this.repo.update(id, updated);
        if(!res) throw new NotUpdatedError('PROJECT');

        await this.cashe.del(`project:${id}`)

        return res
    }

    public async delete(user: UserEntity, id: number) {
        await this.getById(id, user);

        const deleted = await this.repo.delete(id);
        if(!deleted) throw new NotDeletedError('PROJECT');

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
