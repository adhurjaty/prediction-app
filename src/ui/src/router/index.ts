import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: import('../views/Home.vue'),
  },
  {
    path: '/groups',
    name: 'Groups',
    component: import('../views/GroupsList.vue'),
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('../views/FriendsList.vue'),
  },
  {
    path: '/bets',
    name: 'Bets',
    component: () => import('../views/BetsList.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue'),
  },
  {
    path: '/groups/create',
    name: 'Create Group',
    component: () => import('../views/CreateGroup.vue'),
  },
  {
    path: '/groups/group',
    name: 'Group',
    component: () => import('../views/Group.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
  },
  {
      path: '/contract',
      name: 'Contract',
      component: () => import('../views/Contract.vue')
  },
  {
    path: '/confirm',
    name: 'Confirm',
    component: () => import('../views/Confirm.vue')
  },
  {
      path: '/secret',
      name: 'Secret',
      component: () => import('../views/Secret.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
