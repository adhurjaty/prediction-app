import { groupsModule } from '@/groups'
import { oauthModule } from '@/oauth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: import('./views/Home.vue'),
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('./views/FriendsList.vue'),
  },
  {
    path: '/bets',
    name: 'Bets',
    component: () => import('./views/BetsList.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('./views/Account.vue'),
  },
  ...groupsModule.routes(),
  ...oauthModule.routes(),
  {
    path: '/groups/:id/add-bet',
    name: 'Add Bet',
    component: () => import('./views/AddBet.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  },
  {
      path: '/contract',
      name: 'Contract',
      component: () => import('./views/Contract.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
