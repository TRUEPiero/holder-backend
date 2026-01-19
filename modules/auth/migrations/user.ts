import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const hash =  async (password: string) =>  await Bun.password.hash(password)

await db.user.createMany({
    data: [
        {
            login: 'admin@test.su',
            email: 'admin@test.su',
            name: 'Admin',
            password: await hash('adminuser'),
            role: 'admin',
        },
        {
            login: 'demo@test.su',
            email: 'demo@test.su',
            name: 'Demo',
            password: await hash('demouser'),
            role: 'demo',
        },
    ]
})
