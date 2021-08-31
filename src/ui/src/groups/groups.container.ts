import { container } from "inversify-props";
import { CreateGroupCommand, ICreateGroupCommand } from "./commands/createGroupCommand";
import { IUpdateGroupCommand, UpdateGroupCommand } from "./commands/updateGroupCommand";
import { GroupQuery, IGroupQuery } from "./queries/groupQuery";
import { GroupsQuery, IGroupsQuery } from "./queries/groupsQuery";

export default () => {
    container.addSingleton<ICreateGroupCommand>(CreateGroupCommand);
    container.addSingleton<IUpdateGroupCommand>(UpdateGroupCommand);
    container.addSingleton<IGroupQuery>(GroupQuery);
    container.addSingleton<IGroupsQuery>(GroupsQuery);
};
