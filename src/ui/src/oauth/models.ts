export class GoogleOauth {
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

export class OauthConfirmRequest {
    public code : string = '';
    public verifier : string = '';

    constructor(init? : Partial<OauthConfirmRequest>) {
        Object.assign(this, init);
    }
}

export class OauthConfirmResponse {
    public idToken : string = '';

    constructor(init? : Partial<OauthConfirmResponse>) {
        Object.assign(this, init);
    }
}
