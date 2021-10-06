import {
    MutationTree,
    ActionTree,
    ActionContext,
    Store as VuexStore,
    CommitOptions,
    DispatchOptions,
    Module,
    GetterTree
} from 'vuex';
import { Group } from "@/groups/models";
import { IGroupQuery } from "@/groups/queries/groupQuery";
import { cid, container, inject } from "inversify-props";
import { RootState } from '@/app.store';


export enum GroupsMutations {
    SET_GROUP = 'SET_GROUP'
}

export enum GroupsActions {
    FETCH_GROUP = 'FETCH_GROUP'

}

export type State = {
    group: Group | null
};

export type Getters = {
    getGroup(state: State): Group | null;
}

type Mutations<S = State> = {
    [GroupsMutations.SET_GROUP](state: S, group: Group): void
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

const state: State = {
    group: null
}

const getters: GetterTree<State, RootState> & Getters = {
    getGroup: (state) => state.group,
};

const mutations: MutationTree<State> & Mutations = {
    [GroupsMutations.SET_GROUP](state: State, group: Group) {
        state.group = group;
    }
}

export interface Actions {
    [GroupsActions.FETCH_GROUP](
        { commit }: AugmentedActionContext,
        group: string
    ): Promise<void>;
}

const actions: ActionTree<State, RootState> & Actions = {
    async [GroupsActions.FETCH_GROUP]({ commit }, groupId: string) {
        const groupQuery = container.get<IGroupQuery>(cid.GroupQuery);
        const group = await groupQuery.query(groupId);
        commit(GroupsMutations.SET_GROUP, group);
    }
}

export type GroupStore<S = State> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
& {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
        key: K,
        payload: P,
        options?: CommitOptions
    ): ReturnType<Mutations[K]>;
} & {
    dispatch<K extends keyof Actions>(
        key: K,
        payload: Parameters<Actions[K]>[1],
        options?: DispatchOptions
    ): ReturnType<Actions[K]>;
} & {
    getters: {
        [K in keyof Getters]: ReturnType<Getters[K]>
    };
};

export const store: Module<State, RootState> = {
    state,
    getters,
    mutations,
    actions
};
