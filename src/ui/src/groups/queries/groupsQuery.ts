import { IApi } from "@/backend/apiInterface";
import { authorize } from "@/util/helpers";
import { inject, injectable } from "inversify-props";
import Group from "../models";

export interface IGroupsQuery {
    query(): Promise<Group[]>;
}

@injectable()
export class GroupsQuery implements IGroupsQuery {
    @inject() api: IApi;

    @authorize
    public async query(): Promise<Group[]> {
        return await this.api.authGet<Group[]>('/groups');
    }
}