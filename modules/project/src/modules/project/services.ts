import { DirectoryService } from "@shared/DirectoryService";
import { ProjectEntity } from "./entities/Project";
import { Project } from "./types";

export class ProjectService extends DirectoryService<'project'> {

    constructor() {
        super("project", ['owner'])
    }

    public async getProject(id: number) {
        const data = (await this.getById(id)).data;
        if(!data) throw new Error("PROJECT_UNDEFINED");

        return new ProjectEntity(data);
    }

    public async getUserProjects(user: any) {
        const data = (await this.getByFields({ownerId: user.id})).data;

        const projects = data.map((p: Project) => new ProjectEntity(p)) ?? [];

        return {data: projects}
    }

    public async getDetailProject(id: number) {
        const detailProject = await this.getFirstByFields(
            {id},
            {
                members: {
                    include: {users: true}
                },
                cashboxes: true
            }
        )

        if(!detailProject) throw new Error('PROJECT_UNDEFINED'); 

        return detailProject
    }

    public async updateProject(projectId: number, data: any) {
        const project = await this.getById(projectId);
        if(!project.data) throw new Error('PROJECT_UNDEFINED')

        const updatedProject = await this.updateItem(
            projectId, 
            {
                ...data
            }
        )
        if(!updatedProject.data) throw new Error('UPDATE_FAILED');

        return updatedProject;
    }

    public async createProject(user: any, body: any) {
        const project = await this.createItem({
            ownerId: user.id,
            ...body
        });

        if(!project) throw new Error('PROJECT_NOT_CREATED');

        return project;
    }

    public async deleteProject(id: number) {
        return await this.deleteItem(id);
    }
}
