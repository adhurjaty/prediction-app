import { createStore, createLogger } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

import { store as groups, GroupStore, State as GroupState } from './groups/groups.store';
import { store as users, UsersStore, State as UsersState } from './users/users.store';

export type RootState = {
    groups: GroupState,
    users: UsersState
};

export type Store = GroupStore<Pick<RootState, 'groups'>>
    & UsersStore<Pick<RootState, 'users'>>;

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
        users
    },
});

export function useStore(): Store {
  return store as Store;
}
