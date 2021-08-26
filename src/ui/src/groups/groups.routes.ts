import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => {
    return [
        {
            path: '/groups',
            name: 'Groups',
            component: import('../views/GroupsList.vue'),
        },
        {
            path: '/groups/create/',
            name: 'Create Group',
            component: () => import('../views/CreateGroup.vue'),
        },
        {
            path: '/groups/:id',
            name: 'Group',
            component: () => import('../views/Group.vue'),
        }
    ]
}
