import { base64URLEncode, randomString } from '../util/helpers';

class GoogleOauth {
    public client_id: string = '';
    public redirect_uri: string = '';
    public response_type: string = '';
    public scope: string = '';
    public access_type: string = '';
    public securityToken: string = '';
    public origin?: string;

    constructor(init?: Partial<GoogleOauth>) {
        Object.assign(this, init);
    }

    toUrl(baseUrl: string): URL {
        const url = new URL(baseUrl);
        url.searchParams.append('client_id', this.client_id);
        url.searchParams.append('redirect_uri', this.redirect_uri);
        url.searchParams.append('response_type', this.response_type);
        url.searchParams.append('scope', this.scope);
        let state = `security_token=${this.securityToken}`;
        if(this.origin) {
            state += `&origin=${this.origin}`
        }
        url.searchParams.append('state', state);
        url.searchParams.append('access_type', this.access_type);
        return url;
    }
}

export default class GoogleLogin {
    createVerifier() : string {
        return randomString(32);
    }

    codeUrl(verifier : string, origin?: string) : string {
        const googleLogin = new GoogleOauth({
            client_id: '466916983544-t7m40b8hn047m9v5hcbgr9q2vt6hsavm.apps.googleusercontent.com',
            redirect_uri: 'http://localhost:8080/confirm',
            response_type: 'code',
            scope: 'openid email',
            access_type: 'offline',
            securityToken: verifier,
            origin: origin
        });

        const google_base_url = 'https://accounts.google.com/o/oauth2/v2/auth';
        return googleLogin.toUrl(google_base_url).href;
    }
}
