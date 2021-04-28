import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export class OauthConfirmRequest {
    public code : string = '';
    public verifier : string = '';

    constructor(init? : Partial<OauthConfirmRequest>) {
        Object.assign(this, init);
    }
}

export class OauthConfirmResponse {
    public accessToken : string = '';

    constructor(init? : Partial<OauthConfirmResponse>) {
        Object.assign(this, init);
    }
}

export async function authConfirm(request : OauthConfirmRequest) {
    const resp = await axios.post(`${BASE_URL}/oauth/codelogin`, request);
    debugger;
    return new OauthConfirmResponse({
        accessToken: resp.data.accessToken
    });
}