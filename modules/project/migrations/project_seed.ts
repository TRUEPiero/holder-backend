import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

await db.project.createMany({
    data: [
        {
            title: 'Дефолтный проект',
            default: true,
            parameters: JSON.stringify({}),
            ownerId: 1,
        },
        {
            title: 'Тестовый проект',
            default: false,
            parameters: JSON.stringify({}),
            ownerId: 1,
        }
    ]
})
