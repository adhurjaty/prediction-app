import { NavigationGuardNext, NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router';
import { TOKEN_KEY } from '@/util/constants';
import { Store, store } from '@/app.store';
import { UsersActions } from '@/users/users.store';

const auth: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[] | undefined =  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext) =>
{
    const jwt = window.localStorage.getItem(TOKEN_KEY);
    if (jwt) {
        (store as Store).dispatch(UsersActions.FETCH_USER)
            .then(() => next())
            .catch(() => next({ path: 'login', query: { origin: to.path } }));
    } else {
        next({ path: 'login', query: { origin: to.path } });
    }
}

export default auth;