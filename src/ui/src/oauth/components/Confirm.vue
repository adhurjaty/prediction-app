<template>
    <div>
        {{ message }}
    </div>
</template>

<script lang="ts">
import { inject } from 'inversify-props';
import { Options, Vue } from 'vue-class-component';
import { useRoute } from "vue-router";
import { IConfirmCommand } from '../commands/confirmCommand';

export default class Confirm extends Vue {
    @inject() confirmCommand: IConfirmCommand;
    message: string = 'Confirming...'

    async created(): Promise<void> {
        const query = useRoute().query;
        const code = query.code as string;
        const state = query.state as string;
        try {
            await this.confirmCommand.execute(code, state);
        } catch (error) {
            debugger;
            const _error: Error = error;
            this.message = _error.message;
        }
    }
}

</script>