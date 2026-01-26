import { InlineKeyboard } from "grammy";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient;

export class MenuKeyboard {
    static async mainMenu() {

        const projects = await db.project.findMany({
            where: {
                ownerId: 1
            }
        })

        const buttons = projects.map(({id, title}) => InlineKeyboard.text(title, `project_${id}`));

        return InlineKeyboard.from([buttons]);
            
    }

    static projectList() {
        return new InlineKeyboard() 
    }
}