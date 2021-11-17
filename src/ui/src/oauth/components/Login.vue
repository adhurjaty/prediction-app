<template>
    <section>
        <img src="@/assets/header-icon.png" />
        <h1>delph.ai</h1>
        <div>
            <button @click="login">Login</button>
            <router-link :to="{ name: 'Register'}">
                <a>register</a>
            </router-link>
        </div>
    </section>
</template>

<script lang="ts">
import { inject } from 'inversify-props';
import { Vue } from 'vue-class-component';
import { ILoginCommand } from '../commands/loginCommand';

export default class Secret extends Vue {
    @inject() private loginCommand: ILoginCommand

    login() {
        this.loginCommand.execute(this.$route.query.origin as (string | undefined));
    }
}

</script>


<style lang="scss" scoped>

section {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: $black-header;
    z-index: 999;
    margin: 0;
    padding: 0;
    display: grid;
    place-content: center;
    text-align: center;

    img {
        margin: 0 auto;
    }

    h1 {
        color: #fff;
        font-size: 55px;
        margin-top: 10px;
    }

    a {
        color: #fff;
        display: block;
        text-decoration: underline;
    }

    button {
        @include button;
        margin-bottom: 20px;
    }
}

</style>
