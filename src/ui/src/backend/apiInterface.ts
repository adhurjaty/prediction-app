import { TOKEN_KEY } from '@/util/constants';
import axios from 'axios';
import { Group } from './apiModels';

const BASE_URL = 'http://localhost:5000';

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

export async function authConfirm(request : OauthConfirmRequest): Promise<OauthConfirmResponse> {
    const resp = await axios.post(`${BASE_URL}/oauth/codelogin`, request);
    return new OauthConfirmResponse({
        idToken: resp.data
    });
}

export async function getSecret(): Promise<string> {
    return await authGet(`${BASE_URL}/oauth/secret`);
}

export async function getGroups(): Promise<Group[]> {
    return await authGet<Group[]>(`${BASE_URL}/groups`);
}

async function authGet<T>(url: string): Promise<T> {
    const token = window.localStorage.getItem(TOKEN_KEY);

    try {
        if(!token)
            throw new Error('Unauthorized');

        const resp = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return resp.data as T;
    } catch (e) {
        throw new Error('Unauthorized');
    }
}
