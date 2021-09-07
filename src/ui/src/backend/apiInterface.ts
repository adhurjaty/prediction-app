import { TOKEN_KEY } from '@/util/constants';
import { trimStart } from '@/util/helpers';
import axios from 'axios';
import { injectable } from 'inversify-props';

const BASE_URL = 'http://localhost:5000/';


export interface IApi {
    post<T>(path: string, body: T): Promise<any>;
    authGet<T>(path: string): Promise<T>;
    authPost<T>(path: string, payload: any): Promise<T>;
    authPut<T>(path: string, payload: any): Promise<T>;
}

@injectable()
export class Api implements IApi {
    public async post<T>(path: string, body: T): Promise<any> {
        const url = this.getUrl(path);
        return await axios.post(url, body);
    }

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
