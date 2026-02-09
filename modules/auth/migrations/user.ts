import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const hash =  async (password: string) =>  await Bun.password.hash(password)

await db.user.createMany({
    data: [
        {
            email: 'admin@test.su',
            name: 'Admin',
            password: await hash('adminuser'),
            role: 'admin',
        },
        {
            email: 'demo@test.su',
            name: 'Demo',
            password: await hash('demouser'),
            role: 'demo',
        },
    ]
})
