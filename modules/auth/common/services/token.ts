export class AuthTokenService {
    constructor(private jwt: any) {}

    public async generate(user: any) {
        return this.jwt.sign({
            id: user.id,
            name: user.name,
            telegram: user.telegram
        })
    }
}