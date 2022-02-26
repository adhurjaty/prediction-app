import { RootState } from '@/app.store';
import { executePlaceBetFUSD, executeResolution, getResolutions, getWagers } from '@/contracts/delphaiInterface';
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
import { Bet, Resolution, Wager } from './bets.models';

export enum BetsMutations {
    SET_BET = 'SET_BET',
    SET_BETS = 'SET_BETS',
    SET_WAGER = 'SET_WAGER',
    SET_RESOLUTION = 'SET_RESOLUTION',
    SET_WAGERS = 'SET_WAGERS',
    SET_RESOLUTIONS = 'SET_RESOLUTIONS'
}

export enum BetsActions {
    FETCH_BETS = 'FETCH_BETS',
    FETCH_BET = 'FETCH_BET',
    CREATE_BET = 'CREATE_BET',
    FETCH_WAGERS = 'FETCH_WAGERS',
    FETCH_RESOLUTIONS = 'FETCH_RESOLUTIONS',
    PLACE_WAGER = 'PLACE_WAGER',
    RESOLVE_BET = 'RESOLVE_BET'
}

export type State = {
    bet: Bet | null,
    bets: Bet[],
    wagers: Wager[],
    resolutions: Resolution[]
}

export type Getters = {
    getBet(state: State): Bet | null;
    getBets(state: State): Bet[],
    getWagers(state: State): Wager[],
    getResolutions(state: State): Resolution[]
}


type Mutations<S = State> = {
    [BetsMutations.SET_BET](state: S, bet: Bet): void
    [BetsMutations.SET_BETS](state: S, bets: Bet[]): void
    [BetsMutations.SET_WAGER](state: S, wager: Wager): void
    [BetsMutations.SET_RESOLUTION](state: S, resolution: Resolution): void
    [BetsMutations.SET_WAGERS](state: S, wager: Wager[]): void
    [BetsMutations.SET_RESOLUTIONS](state: S, resolution: Resolution[]): void
}

type AugmentedActionContext = {
    commit<K extends keyof Mutations>(
        key: K,
        payload: Parameters<Mutations[K]>[1]
    ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>

export interface Actions {
    [BetsActions.FETCH_BET]
        ({ state, commit }: AugmentedActionContext, betId: string): Promise<void>
    [BetsActions.FETCH_BETS]
        ({ state, commit }: AugmentedActionContext): Promise<void>,
    [BetsActions.CREATE_BET]
        ({ state, commit }: AugmentedActionContext, bet: Bet & { groupId: string }): Promise<void>
    [BetsActions.FETCH_WAGERS]
        ({ state, commit }: AugmentedActionContext, betId: string): Promise<void>
    [BetsActions.FETCH_RESOLUTIONS]
        ({ state, commit }: AugmentedActionContext, betId: string): Promise<void>
    [BetsActions.PLACE_WAGER]
        ({ state, commit }: AugmentedActionContext, wager: Wager): Promise<void>
    [BetsActions.RESOLVE_BET]
        ({ state, commit }: AugmentedActionContext, resolution: Resolution): Promise<void>
}


const state: State = {
    bet: null,
    bets: [],
    wagers: [],
    resolutions: []
};

const getters: GetterTree<State, RootState> & Getters = {
    getBet: (state) => state.bet,
    getBets: (state) => state.bets,
    getWagers: (state) => state.wagers,
    getResolutions: (state) => state.resolutions
};

const mutations: MutationTree<State> & Mutations = {
    [BetsMutations.SET_BET](state: State, bet: Bet) {
        state.bet = bet;
    },
    [BetsMutations.SET_BETS](state: State, bets: Bet[]) {
        state.bets = bets;
    },
    [BetsMutations.SET_WAGER](state: State, wager: Wager) {
        state.wagers = state.wagers.concat([wager]);
    },
    [BetsMutations.SET_RESOLUTION](state: State, resolution: Resolution) {
        state.resolutions = state.resolutions.concat([resolution]);
    },
    [BetsMutations.SET_WAGERS](state: State, wagers: Wager[]) {
        state.wagers = wagers;
    },
    [BetsMutations.SET_RESOLUTIONS](state: State, resolutions: Resolution[]) {
        state.resolutions = resolutions;
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
    async [BetsActions.CREATE_BET]({ state, commit }, bet: Bet & { groupId: string }) {
        const betsApi = container.get<IBetsApi>(cid.BetsApi);
        const newBet = await betsApi.create(bet);
        commit(BetsMutations.SET_BET, newBet);
    },
    async [BetsActions.FETCH_WAGERS]({ state, commit }, betId: string) {
        const wagers = await getWagers(betId);
        commit(BetsMutations.SET_WAGERS, wagers);
    },
    async [BetsActions.FETCH_RESOLUTIONS]({ state, commit }, betId: string) {
        const resolutions = await getResolutions(betId);
        commit(BetsMutations.SET_RESOLUTIONS, resolutions);
    },
    async [BetsActions.PLACE_WAGER]({ state, commit }, wager: Wager) {
        await executePlaceBetFUSD({
            ...wager
        });
        commit(BetsMutations.SET_WAGER, wager);
    },
    async [BetsActions.RESOLVE_BET]({ state, commit }, resolution: Resolution) {
        await executeResolution({
            ...resolution
        });
        commit(BetsMutations.SET_RESOLUTION, resolution);
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
