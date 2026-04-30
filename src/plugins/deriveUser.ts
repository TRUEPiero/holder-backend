import { container } from "../../modules/containers";
import { UnautorizedError } from "@common/errors";

const { userService } = container;

export const deriveUser = async ({cookie, jwt}: any) => {
    const accessToken = cookie['access_token']?.value;
    if(!accessToken) throw new UnautorizedError();

    let payload = null;
    try {
        payload = await jwt.verify(accessToken);
    } catch (error) {
        console.error(error);
        throw new UnautorizedError();
    }
    if (!payload?.sub) throw new UnautorizedError();

    const user = await userService.getUser(Number(payload.sub));
    return { user };
}
