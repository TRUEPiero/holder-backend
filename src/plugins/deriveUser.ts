import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const deriveUser = async ({cookie, jwt, status}: any) => {
    const token = cookie['auth-token'].value;
    if(!token) return status(401, {error: "unautorized"});

    const payload = await jwt.verify(token)
    if(!payload) return  status(401, {error: "unautorized"});

    const user = await db.user.findFirst({
        where: {
            id: payload.id
        }
    })

    return {user}
}
