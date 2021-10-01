import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './app.router'
import BackButton from './components/BackButton.vue';
import Friend from './components/Friend.vue';
import { containerBuilder } from './app.container';
import { createStore } from 'vuex'
import groups from './store/group.store';


export class AppModule {

    constructor() {
        containerBuilder();
        this.bootstrap();
    }

    private bootstrap(): void {
        const store = createStore({
            state: {},
            modules: {
                groups
            }
        });
        const app = createApp(App)
            .component('BackButton', BackButton)
            .component('Friend', Friend)
            .use(router)
            .use(store)
            .mount('#app')
    }
}

new AppModule();
