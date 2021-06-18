import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import BackButton from './components/BackButton.vue';
import Friend from './components/Friend.vue';
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
    .component('BackButton', BackButton)
    .component('Friend', Friend)
    .use(router)
    .mount('#app')
