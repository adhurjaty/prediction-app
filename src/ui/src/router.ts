import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginControl from './components/LoginControl.vue'
import ContractControl from './components/ContractControl.vue'
import HelloWorld from './components/HelloWorld.vue'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        { path: '/', name: 'home', component: HelloWorld },
        { path: '/contract', name: 'contract', component: ContractControl },
        { path: '/login', name: 'login', component: LoginControl }
    ]
})

export default router;