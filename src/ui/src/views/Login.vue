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
import GoogleLogin from '../auth/googleAuth'

@Options({
    props: {
        googleLogin : GoogleLogin
    }
})

export default class Login extends Vue {
    googleLogin! : GoogleLogin;

    login() {
        debugger;
        window.location.href = this.googleLogin.codeUrl();
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
