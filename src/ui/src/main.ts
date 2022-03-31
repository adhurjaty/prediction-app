import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './app.router'
import BackButton from './components/BackButton.vue';
import Friend from './components/Friend.vue';
import { containerBuilder } from './app.container';
import { store } from './app.store';
import * as dotenv from 'dotenv';
import * as fcl from '@onflow/fcl';

export class AppModule {

    constructor() {
        dotenv.config();

        containerBuilder();
        this.bootstrap();
        this.configureFlow();
    }

    private bootstrap(): void {
        createApp(App)
            .component('BackButton', BackButton)
            .component('Friend', Friend)
            .use(router)
            .use(store)
            .mount('#app')
    }

    private configureFlow() {
        fcl.config({
            "accessNode.api": "http://127.0.0.1:3569",
            "0xdelphai": "0xf8d6e0586b0a20c7",
            "discovery.wallet": "http://localhost:8701/fcl/authn",
            "0xFUSD": "0xf8d6e0586b0a20c7"
        });
    }
}

new AppModule();
