import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './app.router'
import BackButton from './components/BackButton.vue';
import Friend from './components/Friend.vue';
import { containerBuilder } from './app.container';
import { store } from './app.store';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { BASE_URL, REFRESH_KEY, TOKEN_KEY, VERIFIER_KEY } from './util/constants';
import { OauthRefreshRequest } from './oauth/models';

export class AppModule {

    constructor() {
        dotenv.config();

        containerBuilder();
        this.bootstrap();
    }

    private bootstrap(): void {
        createApp(App)
            .component('BackButton', BackButton)
            .component('Friend', Friend)
            .use(router)
            .use(store)
            .mount('#app');
        
        axios.interceptors.response.use(response => response,
            async error => {
                const originalRequest = error.config; 
                if (401 === error.response.status && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const verifier = window.localStorage.getItem(VERIFIER_KEY);

                    if(!verifier) {
                        throw new Error('ERROR, could not get verifier from local storage');
                    }
                    const refreshToken = window.localStorage.getItem(REFRESH_KEY);
                    if (!refreshToken) {
                        throw new Error('ERROR, could not get refresh token from local storage');
                    }
                    const response = await axios.post(`${BASE_URL}oauth/refresh`, new OauthRefreshRequest({
                        refreshToken: refreshToken,
                        verifier: verifier
                    }));
                    if (response.data.idToken) {
                        window.localStorage.setItem(TOKEN_KEY, response.data.idToken);
                        if (response.data.refreshToken?.length) {
                            window.localStorage.setItem(REFRESH_KEY, response.data.refreshToken);
                        }
                    } else {
                        window.localStorage.removeItem(TOKEN_KEY);
                        window.localStorage.removeItem(REFRESH_KEY);
                    }

                    originalRequest.headers['Authorization'] = 'Bearer ' + response.data.idToken;
                    return axios(originalRequest);
                } 
                return Promise.reject(error);
            });
    }
}

new AppModule();
