import { PrismaClient } from "@prisma/client";
import { DirectoryService } from "@shared/DirectoryService";

const db = new PrismaClient();

export class ProjectService extends DirectoryService<'project'> {

    constructor() {
        super("project", [])
    }

    async getUserProjects(user: any, status: any) {
        if(!user) return status(401, {error: 'Unautorized'})
        const projects = await db.project.findMany({
            where: {
                ownerId: user.id
            }
        })

        return projects
    }

    async getDefaultProject(user: any, status: any) {
        if(!user) return status(401, {error: 'Unautorized'})

        const project = await db.project.findFirst({
            where: {
                AND: [
                    {ownerId: user.id},
                    {default: true}
                ]
            }
        })

        return project;
    }
}
