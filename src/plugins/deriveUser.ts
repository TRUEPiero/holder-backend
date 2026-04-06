import { UserService } from "../../modules/auth/src/modules/user/services";

const userService = new UserService();

export const deriveUser = async ({cookie, jwt, status}: any) => {
    const token = cookie['auth-token'].value;
    if(!token) return status(401, {error: "unautorized"});

    const payload = await jwt.verify(token)
    if(!payload) return  status(401, {error: "unautorized"});

    const user = await userService.getUser(payload.id)

    return {user}
}
