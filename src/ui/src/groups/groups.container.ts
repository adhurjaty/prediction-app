import 'reflect-metadata';
import { container } from "inversify-props";
import { GroupsApi, IGroupsApi } from './groups.api';

export default () => {
    container.addSingleton<IGroupsApi>(GroupsApi);
};
