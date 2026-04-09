import { ProjectRepository } from "./repository";

export class ProjectService {

    private lastError: any;

    constructor(private repo: ProjectRepository) {}

    public async checjProjectExist(id: number) {
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
        return this.repo.create({ ownerId: user.id, ...body });
    }

    public async update(id: number, data: any) {
        const project = await this.checjProjectExist(id);

        const updated = project.update(data);
        console.log(updated.getJSON())
        return this.repo.update(id, updated.getJSON());

    }

    public async delete(id: number) {
        await this.checjProjectExist(id);
        return this.repo.delete(id);
    }
}
