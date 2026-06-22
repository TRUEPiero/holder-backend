import { DirectoryService } from "@services/DirectoryService";
import { ProjectEntity } from "../entities/Project";
import { Project } from "../types";
import { PaginationParam } from "@shared-types/index.ts";

export class ProjectRepository {

    constructor(private base: DirectoryService<"project">) {}

    async findById(id: number): Promise<ProjectEntity | null> {
        const data = await this.base.getById(id);
        if(!data) return null;

        return new ProjectEntity(data);
    }

    async findUserProjects(userId: number): Promise<ProjectEntity[]> {
        const filter = {
            OR: [
                {ownerId: userId},
                {members: {
                    some: {
                        userId
                    }
                }}
            ]
        }

        const data = await this.base.getByFields(filter);
        return data.map((p: Project) => new ProjectEntity(p));
    }

    async findDetailed(id: number) {
        const data = await this.base.getFirstByFields(
            { id },
            {
                members: { 
                    where: { isDeleted: false },
                    include: { user: true, role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    } } 
                },
                cashboxes: true,
                settings: {
                    include: {
                        setting: true
                    }
                }
            }
        );
        if(!data) return null; 

        return new ProjectEntity(data);
    }

    async findWithPagination(parameters: PaginationParam) {
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
        const include = {
            settings: {
                include: {setting: true}
            }
        };

        const updated = await this.base.updateItem(id, data, include);
        if(!updated) return null;

        return new ProjectEntity(updated);
    }

    async delete(id: number): Promise<ProjectEntity | null>{
        const deleted = await this.base.deleteItem(id);
        if(!deleted) return null;

        return new ProjectEntity(deleted);
    }
}
