import { PrismaClient } from "@prisma/client";
import { DirectoryService } from "@shared/DirectoryService";

const db = new PrismaClient();

export class ProjectService extends DirectoryService<'project'> {

    constructor() {
        super("project", ['owner'])
    }

    public async getUserProjects(user: any) {
        const projects = await this.getByFields({ownerId: user.id})

        return projects
    }

    public async updateProject(projectId: number, data: any) {
        const project = await this.getById(projectId);

        if(!project.data) return {data: null} 

        const updatedProject = await this.updateItem(projectId, {...data})

        return updatedProject;
    }

    public async getDetailProject(id: number) {
        const detailProject = await db.project.findFirst({
            where: {id},
            include: {
                members: {
                    include: {
                        users: true
                    }
                },
                cashboxes: {
                    select: {
                        balance: true
                    }
                }
            }
        })


        return {data: detailProject || null}
    }
}
