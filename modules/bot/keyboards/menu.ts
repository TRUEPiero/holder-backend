import { InlineKeyboard } from "grammy";
import { PrismaClient } from "@prisma/client";
import { ProjectService } from "../../project/services/project";

const projectService = new ProjectService();

const db = new PrismaClient;

export class MenuKeyboard {

    static registration() {
        return new InlineKeyboard()
            .url('Перейти', 'holder.com')
    }

    static mainMenu() {
        return new InlineKeyboard()
            .text('Список проектов','project_list')
    }

    static async projectList(ownerId: number, limit: number = 5, page: number = 1) {

        const keyboard = new InlineKeyboard();

        const projects = await db.project.findMany({
            where: {
                ownerId
            }
        })

        projects.map(({id, title}, index) => keyboard.text(title, `project_${id}`).row());

        return InlineKeyboard.from(keyboard);
    }

    static async projectMenu() {
        return new InlineKeyboard()
            .text('Список счетов', 'cashbox_list');
    }

    static async cashboxList(projectId: number) {
        const keyboard = new InlineKeyboard();

        const cashboxes = await db.cashbox.findMany({
            where: {projectId}
        });

        cashboxes.map(({id, title}, index) => keyboard.text(title, `cashbox_${id}`).row())

        return InlineKeyboard.from(keyboard);
    }
}
