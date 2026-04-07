import { BaseService } from "@shared/BaseService";
import { UserService } from "../../modules/auth/src/modules/user/services";
import { UserRepository } from "../../modules/auth/src/modules/user/repository";
import { DirectoryService } from "@shared/DirectoryService";

const base = new DirectoryService<'user'>('user', [])
const repo = new UserRepository(base);

const userService = new UserService(repo);

export const deriveUser = async ({cookie, jwt, status}: any) => {
    const token = cookie['auth-token'].value;
    if(!token) return status(401, {code: "UNAUTORIZED", description: ""});

    const payload = await jwt.verify(token)
    if(!payload) return  status(401, {code: "UNAUTORIZED", description: ""});

    const user = await userService.getUser(payload.id)

    return {user}
}
