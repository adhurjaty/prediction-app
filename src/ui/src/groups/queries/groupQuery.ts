import { IApi } from "@/backend/apiInterface";
import { authorize } from "@/util/helpers";
import { inject, injectable } from "inversify-props";
import Group from "../models";

export interface IGroupQuery {
    query(groupId: string): Promise<Group>;
}

@injectable()
export class GroupQuery implements IGroupQuery {
    @inject() api: IApi;

    @authorize
    public async query(groupId: string): Promise<Group> {
        return await this.api.authGet<Group>(`/group/${groupId}`);
    }
}