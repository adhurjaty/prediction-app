<template>
    <div class="container">
        <h1>Secret</h1>
        <div>
            <div>{{ message }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { inject } from 'inversify-props';
import { Options, Vue } from 'vue-class-component';
import { IOauthSecretQuery } from '../oauthSecretQuery';

export default class Secret extends Vue {
    @inject() secretQuery: IOauthSecretQuery
    message: string = "loading..."

    async created(): Promise<void> {
        this.message = await this.secretQuery.query();
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
