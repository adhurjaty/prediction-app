<template>
    <div class="container">
        <h1>Login</h1>
        <div>
            <button @click="login">Login</button>
        </div>
    </div>
</template>

<script lang="ts">
import { inject } from 'inversify-props';
import { Vue } from 'vue-class-component';
import { ILoginCommand } from '../loginCommand';

export default class Secret extends Vue {
    @inject() loginCommand: ILoginCommand
    
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
