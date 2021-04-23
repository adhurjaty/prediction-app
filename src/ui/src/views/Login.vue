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
import googleLoginInstance from '../auth/googleAuth'

export default class Login extends Vue {
    login() {
        window.location.href = googleLoginInstance.codeUrl();
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
