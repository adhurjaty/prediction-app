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
import { VERIFIER_KEY } from '../util/constants';
import GoogleLogin from '../auth/googleAuth'

export default class Login extends Vue {
    login() {
        const googleLogin = new GoogleLogin();
        const verifier = googleLogin.createVerifier();

        window.localStorage.setItem(VERIFIER_KEY, verifier);
        window.location.href = googleLogin.codeUrl(verifier);
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
