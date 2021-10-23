import auth from '@/middleware/auth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

export default (): RouteRecordRaw[] => {
    return [
        {
            path: '/friends',
            name: 'Friends',
            component: () => import('./views/FriendsList.vue'),
            beforeEnter: auth
        },
        {
            path: '/account',
            name: 'Account',
            component: () => import('./views/Account.vue'),
            beforeEnter: auth
        }
    ]
}
