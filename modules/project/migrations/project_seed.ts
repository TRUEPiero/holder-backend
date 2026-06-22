import db from "@common/prisma";

await db.project.createMany({
    data: [
        {
            title: 'Дефолтный проект',
            ownerId: 1,
        },
        {
            title: 'Тестовый проект',
            ownerId: 1,
        }
    ]
})
