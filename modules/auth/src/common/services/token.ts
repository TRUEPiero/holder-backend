import { UserEntity } from "../../modules/user/entities/User";

export class AuthTokenService {
    constructor(private jwt: any) {}

    public generateAccess(user: UserEntity) {
        return this.jwt.sign({
            sub: user.id,
            name: user.name,
            telegram: user.telegram,
            exp: Math.floor(Date.now() / 1000) + 60 * 30
        })
    }

    public generateRefresh(user: UserEntity, jti: string) {
        return this.jwt.sign({
            sub: user.id,
            jti,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
        })
    }
}