import { TYPES } from "@/app.types";
import { Group } from "@/groups/models";
import { inject, injectable } from "inversify-props";
import { IHttp } from "../backend/httpInterface";

export interface IGroupsApi {
    get(id: string): Promise<Group>,
    list(): Promise<Group[]>,
    create(group: Group): Promise<Group>,
    update(group: Group): Promise<Group>
}

@injectable()
export class GroupsApi implements IGroupsApi {
    @inject(TYPES.HTTP) private http!: IHttp

    async get(id: string): Promise<Group> {
        return await this.http.authGet<Group>(`/group/${id}`);
    }

    async list(): Promise<Group[]> {
        return await this.http.authGet<Group[]>('/groups') || [];
    }

    async create(group: Group): Promise<Group> {
        return await this.http.authPost<Group>('/group', {
            name: group.name
        });
    }

    async update(group: Group): Promise<Group> {
        return await this.http.authPut(`/group/${group.id}`, group);
    }
}