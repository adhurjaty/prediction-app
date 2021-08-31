<template>
    <div>
        {{ message }}
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRoute } from "vue-router";

export default class Confirm extends Vue {
    message: string = 'Confirming...'

    async created(): Promise<void> {
        const query = useRoute().query;
        const code = query.code as string;
        const state = query.state as string;
        
    }
}

</script>