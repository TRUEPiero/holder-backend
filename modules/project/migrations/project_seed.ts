import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

await db.project.createMany({
    data: [
        {
            title: 'Дефолтный проект',
            settings: JSON.stringify([
               {code: 'string_code', value: "test value"}
            ]),
            ownerId: 1,
        },
        {
            title: 'Тестовый проект',
            settings: JSON.stringify([]),
            ownerId: 1,
        }
    ]
})
