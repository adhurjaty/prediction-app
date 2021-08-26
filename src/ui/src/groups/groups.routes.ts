import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => {
    return [
        {
            path: '/groups',
            name: 'Groups',
            component: import('./components/GroupsList.vue'),
        },
        {
            path: '/groups/create/',
            name: 'Create Group',
            component: () => import('./components/CreateGroup.vue'),
        },
        {
            path: '/groups/:id',
            name: 'Group',
            component: () => import('./components/Group.vue'),
        }
    ]
}
