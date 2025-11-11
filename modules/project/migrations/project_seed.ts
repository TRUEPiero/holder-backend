import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

await db.project.createMany({
    data: [
        {
            title: 'Дефолтный проект',
            default: true,
            ownerId: 1,
        },
        {
            title: 'Тестовый проект',
            default: false,
            ownerId: 1,
        }
    ]
})
