import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const hash =  async (password: string) =>  await Bun.password.hash(password)

await db.user.createMany({
    data: [
        {
            email: 'admin@test.su',
            name: 'Admin',
            password: await hash('adminuser'),
            telegram: 'truepiero',
            status: 'enterprise',
        },
        {
            email: 'demo@test.su',
            name: 'Demo',
            password: await hash('demouser'),
            status: 'trial',
        },
        {
            email: 'test@test.su',
            name: 'Test',
            password: await hash('demouser'),
            status: 'personal',
        },
    ]
})
