import { UserEntity } from "../../modules/user/entities/User";
import { UnautorizedError } from "@common/errors";

export function requireTokenPurpose(payload: unknown, purpose: 'access' | 'refresh') {
    if (!payload || typeof payload !== 'object') throw new UnautorizedError();
    const claims = payload as Record<string, unknown>;
    const userId = Number(claims.sub);
    if (claims.token_use !== purpose ||
        (typeof claims.sub !== 'number' && typeof claims.sub !== 'string') ||
        !Number.isSafeInteger(userId) || userId <= 0 ||
        typeof claims.exp !== 'number' || !Number.isFinite(claims.exp) ||
        claims.exp <= Math.floor(Date.now() / 1000)) {
        throw new UnautorizedError();
    }
    if (purpose === 'refresh' && (typeof claims.jti !== 'string' || !claims.jti)) {
        throw new UnautorizedError();
    }
    return { userId, jti: claims.jti as string };
}

export class AuthTokenService {
    constructor(private jwt: any) {}

    public generateAccess(user: UserEntity) {
        return this.jwt.sign({
            token_use: 'access',
            sub: user.getId(),
            name: user.getName(),
            telegram: user.getTelegram(),
            exp: Math.floor(Date.now() / 1000) + 60 * 30
        })
    }

    public generateRefresh(user: UserEntity, jti: string) {
        return this.jwt.sign({
            token_use: 'refresh',
            sub: user.getId(),
            jti,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
        })
    }
}
