import db from "@common/prisma"
import { hashPassword } from "../src/lib/password"

const hash =  async (password: string) =>  await hashPassword(password)

await db.user.createMany({
    data: [
        {
            email: 'admin@test.su',
            name: 'Admin',
            password: await hash('adminuser'),
            telegram: 'truepiero',
            telegramId: '1026044206',
            status: 'enterprise',
        },
        {
            email: 'demo@test.su',
            name: 'Demo',
            password: await hash('demouser'),
            telegram: 'holder_manage_bot',

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
