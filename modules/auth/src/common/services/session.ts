import { CasheService } from "@services/CasheService";
import { AuthTokenService } from "./token";
import { UserEntity } from "../../modules/user/entities/User";

export class SessionService {
    constructor(
        private cashe: CasheService,
        private tokenService: AuthTokenService,
    ) {}

    public async create(user: UserEntity) {
        const jti = crypto.randomUUID();

        const access = await this.tokenService!.generateAccess(user);
        const refresh = await this.tokenService!.generateRefresh(user, jti);

        await this.setCashe(jti, user);

        return {access, refresh};
    } 

    public async refresh(oldJti: string, user: UserEntity) {
        await this.cashe.getDel(`refresh:${oldJti}`);

        const newJti = crypto.randomUUID();
        const access = await this.tokenService.generateAccess(user);
        const refresh = await this.tokenService.generateRefresh(user, newJti);

        await this.setCashe(newJti, user);
        return { access, refresh, jti: newJti };
    }

    public async revoke(jti: string) {
        await this.cashe.del(`refresh:${jti}`);
    }

    private async setCashe(jti: string, user: UserEntity) {
        await this.cashe.set(
            `refresh:${jti}`,
            user.getId(),
            60 * 60 * 24 * 30
        );
    }
}