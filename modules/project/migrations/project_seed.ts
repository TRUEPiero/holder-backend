import db from "@common/prisma";

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
