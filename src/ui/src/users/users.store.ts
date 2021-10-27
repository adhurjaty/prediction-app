import { RootState } from "@/app.store";
import User from "@/models/user";
import { cid, container } from "inversify-props";
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
import { IUserFullQuery } from "./queries/userFullQuery";
import { IUserQuery } from "./queries/userQuery";

export enum UsersMutations {
    SET_USER = 'SET_USER'
}

export enum UsersActions {
    FETCH_USER = 'FETCH_USER',
    FETCH_FULL_USER = 'FETCH_FULL_USER'
}

export type State = {
    user: User | null
};

export type Getters = {
    getUser(state: State): User | null;
}

type Mutations<S = State> = {
    [UsersMutations.SET_USER](state: S, user: User): void
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

const state: State = {
    user: null
};

const getters: GetterTree<State, RootState> & Getters = {
    getUser: (state) => state.user
};

const mutations: MutationTree<State> & Mutations = {
    [UsersMutations.SET_USER](state: State, user: User) {
        state.user = user;
    }
}

export interface Actions {
    [UsersActions.FETCH_USER]
        ({ state, commit }: AugmentedActionContext): Promise<void>;
    [UsersActions.FETCH_FULL_USER]
        ({ state, commit }: AugmentedActionContext): Promise<void>;
}

const actions: ActionTree<State, RootState> & Actions = {
    async [UsersActions.FETCH_USER]({ state, commit }) {
        const userQuery = container.get<IUserQuery>(cid.UserQuery);
        const user = await userQuery.query();
        commit(UsersMutations.SET_USER, user);
    },
    async [UsersActions.FETCH_FULL_USER]({ state, commit }) {
        const userQuery = container.get<IUserFullQuery>(cid.UserFullQuery);
        const user = await userQuery.query();
        commit(UsersMutations.SET_USER, user);
    }
};

export type UsersStore<S = State> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
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
        ): ReturnType<Actions[K]>
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
