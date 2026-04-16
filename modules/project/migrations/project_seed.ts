import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

await db.project.createMany({
    data: [
        {
            title: 'Дефолтный проект',
            settings: [],
            ownerId: 1,
        },
        {
            title: 'Тестовый проект',
            settings: [],
            ownerId: 1,
        }
    ]
})
