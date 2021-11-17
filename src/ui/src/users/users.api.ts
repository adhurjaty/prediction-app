import { TYPES } from "@/app.types";
import { IHttp } from "@/backend/httpInterface";
import User from "@/models/user";
import { inject, injectable } from "inversify-props";

export interface IUsersApi {
    get(): Promise<User>,
    getFull(): Promise<User>,
    create(user: User): Promise<User>
}

@injectable()
export class UsersApi implements IUsersApi {
    @inject(TYPES.HTTP) private http!: IHttp;

    async get(): Promise<User> {
        return await this.http.authGet<User>('/user');
    }

    async getFull(): Promise<User> {
        return await this.http.authGet<User>('/fulluser');
    }

    async create(user: User): Promise<User> {
        return await this.http.authPost<User>('/user', {
            name: user.displayName,
            email: user.email
        });
    }
}