import { RootState } from '@/app.store';
import { IDelphai } from '@/contracts/delphaiInterface';
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
import { Bet, Resolution, ResolutionResults, Wager } from './bets.models';

export enum BetsMutations {
    SET_BET = 'SET_BET',
    SET_BETS = 'SET_BETS',
    SET_WAGER = 'SET_WAGER',
    SET_WAGERS = 'SET_WAGERS',
    SET_RESOLUTION_RESULTS = 'SET_RESOLUTION_RESULTS',
    SET_CAN_RESOLVE = 'SET_CAN_RESOLVE'
}

export enum BetsActions {
    FETCH_BETS = 'FETCH_BETS',
    FETCH_BET = 'FETCH_BET',
    CREATE_BET = 'CREATE_BET',
    FETCH_WAGERS = 'FETCH_WAGERS',
    FETCH_RESOLUTION_RESULTS = 'FETCH_RESOLUTION_RESULTS',
    PLACE_WAGER = 'PLACE_WAGER',
    RESOLVE_BET = 'RESOLVE_BET',
    FETCH_CAN_RESOLVE = 'FETCH_CAN_RESOLVE'
}

export type State = {
    bet: Bet | null,
    bets: Bet[],
    wagers: Wager[],
    resolutionResults: ResolutionResults | null,
    canResolveBet: boolean
}

export type Getters = {
    getBet(state: State): Bet | null;
    getBets(state: State): Bet[],
    getWagers(state: State): Wager[],
    getResolutionResults(state: State): ResolutionResults | null
    getCanResolve(state: State): boolean
}


type Mutations<S = State> = {
    [BetsMutations.SET_BET](state: S, bet: Bet): void
    [BetsMutations.SET_BETS](state: S, bets: Bet[]): void
    [BetsMutations.SET_WAGER](state: S, wager: Wager): void
    [BetsMutations.SET_WAGERS](state: S, wager: Wager[]): void
    [BetsMutations.SET_RESOLUTION_RESULTS](state: S, resolutionResults: ResolutionResults): void
    [BetsMutations.SET_CAN_RESOLVE](state: S, canResolve: boolean): void
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
    [BetsActions.FETCH_RESOLUTION_RESULTS]
        ({ state, commit }: AugmentedActionContext, betId: string): Promise<void>
    [BetsActions.PLACE_WAGER]
        ({ state, commit }: AugmentedActionContext, wager: Wager): Promise<void>
    [BetsActions.RESOLVE_BET]
        ({ state, commit }: AugmentedActionContext, resolution: Resolution): Promise<void>
    [BetsActions.FETCH_CAN_RESOLVE]
        ({ state, commit }: AugmentedActionContext, betId: string): Promise<void>
}


const state: State = {
    bet: null,
    bets: [],
    wagers: [],
    resolutionResults: null,
    canResolveBet: false
};

const getters: GetterTree<State, RootState> & Getters = {
    getBet: (state) => state.bet,
    getBets: (state) => state.bets,
    getWagers: (state) => state.wagers,
    getResolutionResults: (state) => state.resolutionResults,
    getCanResolve: (state) => state.canResolveBet
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
    [BetsMutations.SET_WAGERS](state: State, wagers: Wager[]) {
        state.wagers = wagers;
    },
    [BetsMutations.SET_RESOLUTION_RESULTS](state: State, resolutionResults: ResolutionResults) {
        state.resolutionResults = resolutionResults;
    },
    [BetsMutations.SET_CAN_RESOLVE](state: State, canResolve: boolean) {
        state.canResolveBet = canResolve
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
        const delphai = container.get<IDelphai>(cid.Delphai);
        const wagers = await delphai.getWagers(betId);
        commit(BetsMutations.SET_WAGERS, wagers);
    },
    async [BetsActions.FETCH_RESOLUTION_RESULTS]({ state, commit }, betId: string) {
        const delphai = container.get<IDelphai>(cid.Delphai);
        const resolutionResults = await delphai.getResolutionResults(betId);
        commit(BetsMutations.SET_RESOLUTION_RESULTS, resolutionResults)
    },
    async [BetsActions.PLACE_WAGER]({ state, commit }, wager: Wager) {
        const delphai = container.get<IDelphai>(cid.Delphai);
        await delphai.placeBet({
            ...wager
        });
        commit(BetsMutations.SET_WAGER, wager);
    },
    async [BetsActions.RESOLVE_BET]({ state, commit }, resolution: Resolution) {
        const delphai = container.get<IDelphai>(cid.Delphai);
        await delphai.voteToResolve({
            ...resolution
        });
    },
    async [BetsActions.FETCH_CAN_RESOLVE]({ state, commit }, betId: string) {
        const delphai = container.get<IDelphai>(cid.Delphai);
        const hasVote = await delphai.hasResolutionVote(betId);
        commit(BetsMutations.SET_CAN_RESOLVE, hasVote);
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
