import { container } from "../../modules/containers";
import { UnautorizedError } from "@common/errors";
import { requireTokenPurpose } from "../../modules/user/src/common/services/token";

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
    const { userId } = requireTokenPurpose(payload, 'access');

    const user = await userService.getById(userId);
    return { user };
}
