import { IApi } from "@/backend/apiInterface";
import User from "@/models/user";
import { inject, injectable } from "inversify-props";

export interface IUserFullQuery {
    query(): Promise<User>
}

@injectable()
export class UserFullQuery implements IUserFullQuery {
    @inject() private api: IApi;
    
    async query(): Promise<User> {
        return await this.api.authGet<User>('/fulluser');
    }

}