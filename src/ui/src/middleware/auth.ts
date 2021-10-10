import { NavigationGuardNext, NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router';
import { TOKEN_KEY } from '@/util/constants';

const auth: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[] | undefined
 =  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
 ) => {
    if (!window.localStorage.getItem(TOKEN_KEY)) next({ path: 'login' })
    else next();
}
export default auth;