import { UserEntity } from "../../../../auth/src/modules/user/entities/User";
import { UserService } from "../../../../auth/src/modules/user/services";
import { ProjectRepository } from "./repository";

export class ProjectService {

    private lastError: any;

    constructor(
        private repo: ProjectRepository,
        private userService: UserService
    ) {}

    public async getById(id: number) {
        if(!id) throw new Error("ID_NOT_VALID");

        const project = await this.repo.findById(id);
        if (!project) throw new Error("PROJECT_NOT_FOUND");
        return project;
    }

    public async getByUser(user: UserEntity) {
        return await this.repo.findUserProjects(user.id);
    }

    public async getDetail(id: number) {
        const project = await this.repo.findDetailedProject(id);
        if (!project) throw new Error("PROJECT_NOT_FOUND");
        return project;
    }

    public async getWithPagination(parameters: any) {
        const projects = await this.repo.findWithPagination(parameters);
        return projects;
    }

    public async create(user: UserEntity, body: any) {
        const createData = { 
            owner: user.id, 
            ...body,
            settings: body.settings ?? []
        };

        const created = await this.repo.create(createData);
        if(!created) throw new Error("PROJECT_NOT_CREATED");
        return created;
    }

    public async update(user: UserEntity, id: number, data: any) {
        const project = await this.getDetail(id);
        
        const access = project.checkAccess(user)
        if(!access) throw new Error('ACCESS_DENIED')

        const updated = project.update(data);

        return this.repo.update(id, updated);

    }

    public async delete(user: UserEntity, id: number) {
        const project = await this.getDetail(id);

        const access = project.checkAccess(user)       
        if(!access) throw new Error('ACCESS_DENIED')

        const deleted = await this.repo.delete(id);
        if(!deleted) throw new Error("PROJECT_NOT_DELETED");

        return deleted;
    }
}
