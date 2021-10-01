import { Group } from "@/groups/models";
import { IGroupQuery } from "@/groups/queries/groupQuery";
import { inject } from "inversify-props";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module
export default class GroupStore extends VuexModule {
    @inject() groupQuery!: IGroupQuery;

    group: Group | null = null;

    @Mutation
    setGroup(group: Group): void {
        this.group = group;
    }

    @Action({commit: 'setGroup'})
    async fetchGroup(groupId: string): Promise<Group> {
        return await this.groupQuery.query(groupId);
    }
}