import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
//import VueRouter from 'vue-router'
//import Vue from 'vue'

// Vue.config.productionTip = false;

// /* eslint-disable no-new */
// new Vue({
//     el: '#app',
//     router,
//     template: '<App/>',
//     components: { App }
//   })
createApp(App)
    .use(router)
    .mount('#app')
