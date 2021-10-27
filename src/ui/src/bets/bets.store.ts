import { RootState } from '@/app.store';
import { cid, container } from 'inversify-props';
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
import { IBetsApi } from './bets.api';
import { Bet } from './bets.models';

export enum BetsMutations {
    SET_BET = 'SET_BET',
    SET_BETS = 'SET_BETS'
}

export enum BetsActions {
    FETCH_BETS = 'FETCH_BETS',
    FETCH_BET = 'FETCH_BET',
    CREATE_BET = 'CREATE_BET'
}

export type State = {
    bet: Bet | null,
    bets: Bet[]
}

export type Getters = {
    getBet(state: State): Bet | null;
    getBets(state: State): Bet[]
}


type Mutations<S = State> = {
    [BetsMutations.SET_BET](state: S, bet: Bet): void
    [BetsMutations.SET_BETS](state: S, bets: Bet[]): void
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [BetsActions.FETCH_BET]
        ({ state, commit }: AugmentedActionContext, betId: string): Promise<void>,
    [BetsActions.FETCH_BETS]
        ({ state, commit }: AugmentedActionContext): Promise<void>,
    [BetsActions.CREATE_BET]
        ({ state, commit }: AugmentedActionContext, bet: Bet): Promise<void>
}


const state: State = {
    bet: null,
    bets: []
};

const getters: GetterTree<State, RootState> & Getters = {
    getBet: (state) => state.bet,
    getBets: (state) => state.bets
};

const mutations: MutationTree<State> & Mutations = {
    [BetsMutations.SET_BET](state: State, bet: Bet) {
        state.bet = bet;
    },
    [BetsMutations.SET_BETS](state: State, bets: Bet[]) {
        state.bets = bets;
    }
};

const actions: ActionTree<State, RootState> & Actions = {
    async [BetsActions.FETCH_BET]({ state, commit }, betId: string) {
        if (state.bet?.id == betId) {
            return
        }
        const betsApi = container.get<IBetsApi>(cid.BetsApi);
        const bet = await betsApi.get(betId);
        commit(BetsMutations.SET_BET, bet);
    },
    async [BetsActions.FETCH_BETS]({ state, commit }) {
        const betsApi = container.get<IBetsApi>(cid.BetsApi);
        const bets = await betsApi.list();
        commit(BetsMutations.SET_BETS, bets);
    },
    async [BetsActions.CREATE_BET]({ state, commit }, bet: Bet) {
        const betsApi = container.get<IBetsApi>(cid.BetsApi);
        const newBet = await betsApi.create(bet);
        commit(BetsMutations.SET_BET, newBet);
    }
}

export type BetStore<S = State> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch' >
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
}

export const store: Module<State, RootState> = {
    state,
    getters,
    mutations,
    actions
};
