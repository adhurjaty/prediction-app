import { IApi } from "@/backend/apiInterface";
import User from "@/models/user";
import { inject, injectable } from "inversify-props";

export interface IUserQuery {
    query(): Promise<User>
}

@injectable()
export class UserQuery implements IUserQuery {
    @inject() api!: IApi;
    
    async query(): Promise<User> {
        return await this.api.authGet<User>('/user');
    }
}