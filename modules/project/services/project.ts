import { PrismaClient } from "@prisma/client";
import { DirectoryService } from "@shared/DirectoryService";

const db = new PrismaClient();

export class ProjectService extends DirectoryService<'project'> {

    constructor() {
        super("project", [])
    }

    public async getUserProjects(user: any) {
        const projects = await this.getByFields({ownerId: user.id})

        return projects
    }

    public async getDefaultProject(user: any) {
        const project = await this.getFirstByFields({
            AND: [
                {ownerId: user.id},
                {default: true}
            ]
        })

        return await this.getDetailProject(project.data.id);
    }

    public async updateProject(projectId: number, data: any) {
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
                        amount: true
                    }
                }
            }
        })

        if(!detailProject) return null

        const members = detailProject.members.flatMap(member => {
            return {
                ...member.users,
                role: member.role
            }
        })

        const amount = detailProject.cashboxes.reduce((sum, item) => sum + item.amount, 0)

        return {
            ...detailProject,
            members,
            amount
        }
    }
}
