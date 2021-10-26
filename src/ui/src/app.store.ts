import { createStore, createLogger } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

import { store as groups, GroupStore, State as GroupState } from './groups/groups.store';
import { store as users, UsersStore, State as UsersState } from './users/users.store';
import { store as bets, BetStore, State as BetState } from './bets/bets.store';

export type RootState = {
    groups: GroupState,
    users: UsersState,
    bets: BetState
};

export type Store = GroupStore<Pick<RootState, 'groups'>>
    & UsersStore<Pick<RootState, 'users'>>
    & BetStore<Pick<RootState, 'bets'>>;

// disable persisted state for now
// Plug in logger when in development environment
// const debug = process.env.NODE_ENV !== 'production';
// const plugins = debug ? [createLogger({})] : [];

// // Plug in session storage based persistence
// plugins.push(createPersistedState({ storage: window.sessionStorage }));

export const store = createStore({
    // plugins,
    modules: {
        groups,
        users,
        bets
    },
});

export function useStore(): Store {
  return store as Store;
}
