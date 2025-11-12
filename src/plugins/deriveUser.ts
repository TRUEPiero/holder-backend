import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const deriveUser = async ({cookie, jwt}: any) => {
    const token = cookie['auth-token'].value;
    if(!token) return {user: null};

    const payload = await jwt.verify(token)
    if(!payload) return  {user: null};

    const user = await db.user.findFirst({
        where: {
            id: payload.id
        }
    })

    return {user}
}
