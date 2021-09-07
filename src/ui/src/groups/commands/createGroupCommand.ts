import { IApi } from "@/backend/apiInterface";
import { authorize } from "@/util/helpers";
import { inject, injectable } from "inversify-props";
import { Group } from "../models";

export interface ICreateGroupCommand {
    execute(group: Group): Promise<Group>;
}

@injectable()
export class CreateGroupCommand implements ICreateGroupCommand {
    @inject() api: IApi;

    @authorize
    public async execute(group: Group): Promise<Group> {
        return await this.api.authPost<Group>('/group', {
            name: group.name
        });
    }
}