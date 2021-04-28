import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import GoogleLogin from '../auth/googleAuth'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
