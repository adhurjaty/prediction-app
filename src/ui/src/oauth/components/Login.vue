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
import { VERIFIER_KEY } from '../../util/constants';
import GoogleLogin from '../googleLogin'
import { useRoute } from "vue-router";

export default class Secret extends Vue {
    login() {
        const googleLogin = new GoogleLogin();
        const verifier = googleLogin.createVerifier();

        window.localStorage.setItem(VERIFIER_KEY, verifier);

        const origin = this.$route.query.origin as (string | undefined);

        window.location.href = googleLogin.codeUrl(verifier, origin);
    }
}

</script>


<style lang="scss" scoped>

.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h1 {
        padding: 15px;
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
