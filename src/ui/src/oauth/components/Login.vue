<template>
    <div class="container align-items-center">
        <h1>Bragging Rights</h1>
        <button  @click="login">Sign in with google</button>
    </div>
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

.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 50px;

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

    button {
        align-self: center;
    }
}

</style>
