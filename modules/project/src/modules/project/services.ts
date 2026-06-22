import { PaginationParam, PaginationResult } from "@shared-types/index.ts";
import { UserEntity } from "../../../../auth/src/modules/user/entities/User";
import { ProjectRepository } from "./repositories/project";
import { SettingsOwner } from "../../interfaces/SettingsOwner";
import { SettingTargets } from "@shared-types/index.ts";
import { CasheService } from "@services/CasheService";
import { ProjectEntity } from "./entities/Project";
import { InvalidFieldError, NotCreatedError, NotDeletedError, NotFoundError, NotUpdatedError } from "@common/errors";
import { authorizeMode, ProjectPermission, ProjectPolicy } from "../../policies/project.policy";
import { CRUD } from "../../interfaces/Crud";

export class ProjectService extends CRUD implements SettingsOwner{

    constructor(
        private repo: ProjectRepository,
        private cashe: CasheService
    ) {
        super()
    }

    public async authorize(
        projectId: number,
        user: UserEntity,
        permission: ProjectPermission | ProjectPermission[],
        mode: authorizeMode = 'all'
    ) {
        const project = await this.getById(projectId);

        ProjectPolicy.authorize(project, user, permission, mode);

        return project;
    }

    public async getById(id: number): Promise<ProjectEntity> {
        if(!id) throw new InvalidFieldError('ID');

        let project: ProjectEntity | null = null;
        
        const cashed = await this.cashe.get(`project:${id}`)
        if(cashed) {
            project = new ProjectEntity(cashed);
        } else {
            const dbProject = await this.repo.findDetailed(id);
            if (!dbProject) throw new NotFoundError('PROJECT');

            project = dbProject;

            await this.cashe.set(`project:${id}`, project)
        }

        return project;
    }

    public async getByUser(user: UserEntity): Promise<any[]> {
        const projects = await this.repo.findUserProjects(user.getId());
        return projects.map(i => i.response())
    }

    public async getWithPagination(parameters: PaginationParam): Promise<PaginationResult> {
        return await this.repo.findWithPagination(parameters);
    }

    public async create(user: UserEntity, body: any) {
        const createData = { 
            owner: user.getId(), 
            ...body,
        };

        const created = await this.repo.create(createData);
        if(!created) throw new NotCreatedError('PROJECT');
        return created;
    }

    public async update(id: number, user: UserEntity, data: any) {
        const project = await this.authorize(id, user, 'project:update');

        const updated = project.update(data);

        const res = await this.repo.update(id, updated);
        if(!res) throw new NotUpdatedError('PROJECT');

        await this.cashe.del(`project:${id}`)

        return res
    }

    public async delete(id: number, user: UserEntity) {
        await this.authorize(id, user, 'project:delete');

        const deleted = await this.repo.delete(id);
        if(!deleted) throw new NotDeletedError('PROJECT');

        await this.cashe.del(`project:${id}`)

        return deleted;
    }

    public getSettingTarget(): SettingTargets {
        return 'project'
    }
}
