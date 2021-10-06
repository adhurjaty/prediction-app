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
import { IGroupsQuery } from './queries/groupsQuery';


export enum GroupsMutations {
    SET_GROUP = 'SET_GROUP',
    SET_GROUPS = 'SET_GROUPS'
}

export enum GroupsActions {
    FETCH_GROUP = 'FETCH_GROUP',
    FETCH_GROUPS = 'FETCH_GROUPS'
}

export type State = {
    group: Group | null,
    groups: Group[]
};

export type Getters = {
    getGroup(state: State): Group | null;
    getGroups(state: State): Group[];
}

type Mutations<S = State> = {
    [GroupsMutations.SET_GROUP](state: S, group: Group): void,
    [GroupsMutations.SET_GROUPS](state: S, groups: Group[]): void
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1],
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

const state: State = {
    group: null,
    groups: []
}

const getters: GetterTree<State, RootState> & Getters = {
    getGroup: (state) => state.group,
    getGroups: (state) => state.groups
};

const mutations: MutationTree<State> & Mutations = {
    [GroupsMutations.SET_GROUP](state: State, group: Group) {
        state.group = group;
    },
    [GroupsMutations.SET_GROUPS](state: State, groups: Group[]) {
        state.groups = groups;
    }
}

export interface Actions {
    [GroupsActions.FETCH_GROUP]
        ({ commit }: AugmentedActionContext, groupId: string): Promise<void>;
    [GroupsActions.FETCH_GROUPS]
        ({ commit }: AugmentedActionContext): Promise<void>;
}

const actions: ActionTree<State, RootState> & Actions = {
    async [GroupsActions.FETCH_GROUP]({ commit }, groupId: string) {
        const groupQuery = container.get<IGroupQuery>(cid.GroupQuery);
        const group = await groupQuery.query(groupId);
        commit(GroupsMutations.SET_GROUP, group);
    },
    async [GroupsActions.FETCH_GROUPS]({ commit }) {
        const groupsQuery = container.get<IGroupsQuery>(cid.GroupsQuery);
        const groups = await groupsQuery.query() || [];
        commit(GroupsMutations.SET_GROUPS, groups);
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
        payload?: Parameters<Actions[K]>[1],
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
