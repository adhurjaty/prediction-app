import auth from "@/middleware/auth";
import { RouteRecordRaw } from "vue-router";

export default (): RouteRecordRaw[] => {
    return [
        {
            path: '/groups',
            name: 'Groups',
            component: import('./views/GroupsList.vue'),
            beforeEnter: auth
        },
        {
            path: '/groups/create/',
            name: 'Create Group',
            component: () => import('./views/CreateGroup.vue'),
            beforeEnter: auth
        },
        {
            path: '/groups/:id',
            name: 'Group',
            component: () => import('./views/Group.vue'),
            beforeEnter: auth
        },
        {
            path: '/groups/:id/add-members',
            name: 'Add Members',
            component: () => import('./views/AddMembers.vue'),
            beforeEnter: auth
          },
    ]
}
