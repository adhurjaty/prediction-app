<template>
    <div class="container">
        <h1>Secret</h1>
        <div>
            <div>{{ message }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { getSecret } from '../backend/apiInterface';

export default class Secret extends Vue {
    message: string = "loading..."

    async mounted(): Promise<void> {
        this.message = await getSecret();
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
