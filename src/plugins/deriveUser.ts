import { container } from "../../modules/containers";

const {userService} = container;

export const deriveUser = async ({cookie, jwt, status}: any) => {
    const token = cookie['auth-token'].value;
    if(!token) return status(401, {code: "UNAUTORIZED", description: ""});

    const payload = await jwt.verify(token)
    if(!payload) return  status(401, {code: "UNAUTORIZED", description: ""});

    const user = await userService.getUser(payload.id)

    return {user}
}
