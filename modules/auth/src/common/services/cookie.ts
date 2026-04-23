export class AuthCookieService {
    constructor(private cookie: any) {}

    public async set(token: string, remember: boolean = false) {
        this.cookie['auth-token'].set({
             value: token,
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
            path: '/'
        })
    }
}