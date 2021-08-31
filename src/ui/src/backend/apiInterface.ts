import { TOKEN_KEY } from '@/util/constants';
import { trimStart } from '@/util/helpers';
import axios from 'axios';
import { injectable } from 'inversify-props';
import Group from '../groups/models';

const BASE_URL = 'http://localhost:5000/';


export interface IApi {
    authGet<T>(path: string): Promise<T>;
    authPost<T>(path: string, payload: any): Promise<T>;
    authPost<T>(path: string, payload: any): Promise<T>;
}

@injectable()
export class Api implements IApi {
    public async authGet<T>(path: string): Promise<T> {
        const url = this.getUrl(path);
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
    
    public async authPost<T>(path: string, payload: any): Promise<T> {
        const url = this.getUrl(path);
        const token = window.localStorage.getItem(TOKEN_KEY);
    
        try {
            if(!token)
                throw new Error('Unauthorized');
    
            const resp = await axios.post(url, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return resp.data as T;
        } catch (e) {
            console.log(e);
            throw new Error('Unauthorized');
        }
    }
    
    public async authPut<T>(path: string, payload: T): Promise<T> {
        const url = this.getUrl(path);
        const token = window.localStorage.getItem(TOKEN_KEY);
    
        try {
            if(!token)
                throw new Error('Unauthorized');
    
            const resp = await axios.put(url, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return resp.data as T;
        } catch (e) {
            throw new Error('Unauthorized');
        }
    }

    private getUrl(path: string): string {
        return `${BASE_URL}${trimStart(path, '/')}`;
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

export async function getGroup(groupId: string): Promise<Group> {
    return await authGet<Group>(`${BASE_URL}/group/${groupId}`);
}

export async function createGroup(group: Group) : Promise<Group> {
    return await authPost<Group>(`${BASE_URL}/group`, {
        name: group.name
    });
}

export async function updateGroup(group: Group) : Promise<Group> {
    return await authPut(`${BASE_URL}/group/${group.id}`, group);
}
