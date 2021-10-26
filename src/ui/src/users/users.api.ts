import { IHttp } from "@/backend/httpInterface";
import User from "@/models/user";
import { inject, injectable } from "inversify-props";

export interface IUsersApi {
    get(): Promise<User>,
    getFull(): Promise<User>
}

@injectable()
export class UsersApi implements IUsersApi {
    @inject() private http!: IHttp;

    async get(): Promise<User> {
        return await this.http.authGet<User>('/user');
    }

    async getFull(): Promise<User> {
        return await this.http.authGet<User>('/fulluser');
    }
}