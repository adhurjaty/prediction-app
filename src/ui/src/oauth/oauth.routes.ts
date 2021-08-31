import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => {
    return [
        {
            path: '/login',
            name: 'Login',
            component: () => import('./components/Login.vue'),
        },
        {
            path: '/confirm',
            name: 'Confirm',
            component: () => import('./components/Confirm.vue')
        },
        {
            path: '/secret',
            name: 'Secret',
            component: () => import('./components/Secret.vue')
        }
    ]
}