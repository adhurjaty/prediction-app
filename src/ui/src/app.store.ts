import { createStore, createLogger } from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

import { store as groups, GroupStore, State as GroupState } from './groups/group.store';

export type RootState = {
    groups: GroupStore
};

export type Store = GroupStore<Pick<RootState, 'groups'>>;

// disable persisted state for now
// Plug in logger when in development environment
// const debug = process.env.NODE_ENV !== 'production';
// const plugins = debug ? [createLogger({})] : [];

// // Plug in session storage based persistence
// plugins.push(createPersistedState({ storage: window.sessionStorage }));

export const store = createStore({
    // plugins,
    modules: {
        groups
    },
});

export function useStore(): Store {
  return store as Store;
}
