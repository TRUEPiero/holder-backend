import { DirectoryService } from "@shared/DirectoryService";
import { ProjectEntity } from "./entities/Project";
import { Project } from "./types";

export class ProjectRepository {

    constructor(private base: DirectoryService<"project">) {}

    async findById(id: number): Promise<ProjectEntity | null> {
        const data = await this.base.getById(id);
        return data ? new ProjectEntity(data) : null;
    }

    async findUserProjects(userId: number): Promise<ProjectEntity[]> {
        const data = await this.base.getByFields({ ownerId: userId });
        return data.map((p: Project) => new ProjectEntity(p));
    }

    async findDetailedProject(id: number) {
        const data = await this.base.getFirstByFields(
            { id },
            {
                members: { include: { user: true } },
                cashboxes: true
            }
        );

        return new ProjectEntity(data);
    }

    async create(data: any): Promise<ProjectEntity> {
        const created = await this.base.createItem(data);
        return new ProjectEntity(created);
    }

    async update(id: number, data: any): Promise<ProjectEntity> {
        const updated = await this.base.updateItem(id, data);
        return new ProjectEntity(updated);
    }

    async delete(id: number) {
        const project = await this.base.deleteItem(id);

        return new ProjectEntity(project);
    }
}
