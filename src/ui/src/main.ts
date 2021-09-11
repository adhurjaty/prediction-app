import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './app.router'
import BackButton from './components/BackButton.vue';
import Friend from './components/Friend.vue';
import { containerBuilder } from './app.container';


export class AppModule {

    constructor() {
        containerBuilder();
        this.bootstrap();
    }

    private bootstrap(): void {
        createApp(App)
            .component('BackButton', BackButton)
            .component('Friend', Friend)
            .use(router)
            .mount('#app')
    }
}

new AppModule();
