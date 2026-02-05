import { InlineKeyboard } from "grammy";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient;

export class MenuKeyboard {

    static mainMenu() {
        return new InlineKeyboard()
            .text('Список проектов','project_list')
    }

    static async projectList(ownerId: number) {

        const keyboard = new InlineKeyboard();

        const projects = await db.project.findMany({
            where: {
                ownerId
            }
        })

        projects.map(({id, title}) => keyboard.text(title, `project_${id}`).row());

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

        cashboxes.map(({id, title}) => keyboard.text(title, `cashbox_${id}`))

        return InlineKeyboard.from(keyboard);
    }
}
