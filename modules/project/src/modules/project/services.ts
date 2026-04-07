import { ProjectRepository } from "./repository";

export class ProjectService {

    constructor(private repo: ProjectRepository) {}

    public async getProject(id: number) {
        const project = await this.repo.findById(id);
        if (!project) throw new Error("PROJECT_NOT_FOUND");
        return project;
    }

    async getUserProjects(user: any) {
        return await this.repo.findUserProjects(user.id);
    }

    async getDetailProject(id: number) {
        const project = await this.repo.findDetailedProject(id);
        if (!project) throw new Error("PROJECT_NOT_FOUND");
        return project;
    }

    async createProject(user: any, body: any) {
        return this.repo.create({ ownerId: user.id, ...body });
    }

    async updateProject(id: number, data: any) {
        await this.getProject(id);
        return this.repo.update(id, data);
    }

    async deleteProject(id: number) {
        await this.getProject(id);
        return this.repo.delete(id);
    }
}
