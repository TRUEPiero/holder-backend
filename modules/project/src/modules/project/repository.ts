import { DirectoryService } from "@shared/DirectoryService";
import { ProjectEntity } from "./entities/Project";
import { Project } from "./types";

export class ProjectRepository {

    constructor(private base: DirectoryService<"project">) {}

    async findById(id: number): Promise<ProjectEntity | null> {
        const data = await this.base.getById(id);
        if(!data) return null;

        return new ProjectEntity(data);
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
        if(!data) return null; 

        return new ProjectEntity(data);
    }

    async findWithPagination(parameters: any) {
        const paginationData = await this.base.getWithPagination(parameters); 
        const { currentPage, totalPages, totalItems, hasNextPage } = paginationData;
        
        const items: ProjectEntity[] = paginationData.items.map((p: Project) => new ProjectEntity(p));
        return {
            items,
            pagination: {
                currentPage, 
                totalPages, 
                totalItems, 
                hasNextPage
            }
        }
    }

    async create(data: any): Promise<ProjectEntity | null> {
        const created = await this.base.createItem(data);
        if(!created) return null;

        return new ProjectEntity(created);
    }

    async update(id: number, data: any): Promise<ProjectEntity | null> {
        const updated = await this.base.updateItem(id, data);
        if(!updated) return null;

        return new ProjectEntity(updated);
    }

    async delete(id: number): Promise<ProjectEntity | null>{
        const deleted = await this.base.deleteItem(id);
        if(!deleted) return null;

        return new ProjectEntity(deleted);
    }
}
