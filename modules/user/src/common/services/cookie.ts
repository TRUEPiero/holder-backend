export class AuthCookieService {
    constructor(private cookie: any) {}

    public setAccess(token: string) {
        this.cookie['access_token'].set({
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 30,
            path: '/'
        })
    }

    public setRefresh(token: string) {
        this.cookie['refresh_token'].set({
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30,
            path: '/auth'
        })
    }

    clear() {
        this.cookie['access_token'].remove();
        this.cookie['refresh_token'].remove();
    }
}