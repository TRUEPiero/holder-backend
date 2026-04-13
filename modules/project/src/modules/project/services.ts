import { UserService } from "../../../../auth/src/modules/user/services";
import { ProjectRepository } from "./repository";

export class ProjectService {

    private lastError: any;

    constructor(
        private repo: ProjectRepository,
        private userService: UserService
    ) {}

    public async getById(id: number) {
        const project = await this.repo.findById(id);
        if (!project) throw new Error("PROJECT_NOT_FOUND");
        return project;
    }

    public async getByUser(user: any) {
        return await this.repo.findUserProjects(user.id);
    }

    public async getDetail(id: number) {
        const project = await this.repo.findDetailedProject(id);
        if (!project) throw new Error("PROJECT_NOT_FOUND");
        return project;
    }

    public async getWithPagination(settings: any) {
        const projects = await this.repo.findWithPagination(settings);
        return projects;
    }

    public async create(user: any, body: any) {
        let ownerId = this.resolveUserId(user);      

        const created = await this.repo.create({ ownerId, ...body });
        if(!created) throw new Error("PROJECT_NOT_CREATED");
        return created;
    }

    public async update(user: any, id: number, data: any) {
        const project = await this.getDetail(id);
        
        const access = project.checkAccess(user)
        if(!access) throw new Error('ACCESS_DENIED')

        const updated = project.update(data);

        return this.repo.update(id, updated);

    }

    public async delete(user: any, id: number) {
        const project = await this.getDetail(id);

        const access = project.checkAccess(user)
        if(!access) throw new Error('ACCESS_DENIED')

        const deleted = await this.repo.delete(id);
        if(!deleted) throw new Error("PROJECT_NOT_DELETED");

        return deleted;
    }

    private async resolveUserId(user: any) {
        if (typeof user === "object" && user !== null) {
            return user.id;
        } else {
            const userId = Number(user);
            const curUser = await this.userService.getUser(userId);

            if (!curUser) throw new Error("USER_NOT_FOUND");
            return userId;
        }
    } 
}
