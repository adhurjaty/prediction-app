import { base64URLEncode, randomString } from '../util/helpers';

class GoogleOauth {
    public client_id: string = '';
    public redirect_uri: string = '';
    public response_type: string = '';
    public scope: string = '';
    public code_challenge: string = '';
    public code_challenge_method: string = '';

    constructor(init?: Partial<GoogleOauth>) {
        Object.assign(this, init);
    }

    toUrl(baseUrl: string): URL {
        const url = new URL(baseUrl);
        url.searchParams.append('client_id', this.client_id);
        url.searchParams.append('redirect_uri', this.redirect_uri);
        url.searchParams.append('response_type', this.response_type);
        url.searchParams.append('scope', this.scope);
        url.searchParams.append('code_challenge', this.code_challenge);
        url.searchParams.append('code_challenge_method', this.code_challenge_method);
        return url;
    }
}

class GoogleLogin {
    public verifier: string = ''

    codeUrl(): string {
        this.verifier = base64URLEncode(randomString(32));
        const googleLogin = new GoogleOauth({
            client_id: '1008084278102-ablredbu3p4u6ipdm3uv7asj760n6uju.apps.googleusercontent.com',
            redirect_uri: `http://localhost:8080/confirm`,
            response_type: 'code',
            scope: 'profile',
            code_challenge: this.verifier,
            code_challenge_method: 'S256'
        });

        const google_base_url = 'https://accounts.google.com/o/oauth2/v2/auth';
        return googleLogin.toUrl(google_base_url).href;
    }
}

const googleLoginInstance = new GoogleLogin();
export default googleLoginInstance;