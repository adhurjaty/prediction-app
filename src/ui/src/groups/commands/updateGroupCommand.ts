import { IApi } from "@/backend/apiInterface";
import { authorize } from "@/util/helpers";
import { inject, injectable } from "inversify-props";
import Group from "../models";

export interface IUpdateGroupCommand {
    execute(group: Group): Promise<Group>;
}

@injectable()
export class UpdateGroupCommand implements IUpdateGroupCommand {
    @inject() api: IApi;
    
    @authorize
    public async execute(group: Group): Promise<Group> {
        return await this.api.authPut(`/group/${group.id}`, group);
    }
}