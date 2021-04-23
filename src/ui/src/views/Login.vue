<template>
    <div class="container">
        <h1>Login</h1>
        <div>
            <button @click="login">Login</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import crypto from 'crypto';

const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~.';
function randomString(len: number) {
    const allCharLen = allChars.length;
    let str = '';

    for (let _ = 0; _ < len; _++) {
        let idx = Math.floor(Math.random() * allCharLen);
        str += allChars[idx];
    }

    return str;
}


class GoogleLogin {
    public client_id: string = '';
    public redirect_uri: string = '';
    public response_type: string = '';
    public scope: string = '';
    public code_challenge: string = '';
    public code_challenge_method: string = '';

    constructor(init?: Partial<GoogleLogin>) {
        Object.assign(this, init);
    }

    toUrl(baseUrl: string): URL {
        const url = new URL(baseUrl);
        url.searchParams.append('client_id', this.client_id);
        url.searchParams.append('redirect_uri', this.redirect_uri);
        url.searchParams.append('response_type', this.response_type);
        url.searchParams.append('scope', this.scope);
        url.searchParams.append('code_challenge', this.code_challenge);
        url.searchParams.append('code_challenge_method', this.code_challenge_method);
        return url;
    }
}

export default class Login extends Vue {
    login() {
        const verifier = this.base64URLEncode(randomString(32));
        const googleLogin = new GoogleLogin({
            client_id: '1008084278102-ablredbu3p4u6ipdm3uv7asj760n6uju.apps.googleusercontent.com',
            redirect_uri: `http://localhost:8080/confirm`,
            response_type: 'code',
            scope: 'profile',
            code_challenge: verifier,
            code_challenge_method: 'S256'
        });

        const google_base_url = 'https://accounts.google.com/o/oauth2/v2/auth';
        const url = googleLogin.toUrl(google_base_url).href;
        debugger;
        window.location.href = googleLogin.toUrl(google_base_url).href;
    }

    base64URLEncode(str: string): string {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
}

</script>


<style lang="scss" scoped>

.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h1 {
        @include applyPadding;
        align-self: center;
    }

    div {
        padding: 10px;
    }

    span {
        padding-left: 15px;
    }
}

</style>
