<template>
    <div>
        {{ message }}
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRoute } from "vue-router";
import { authConfirm, OauthConfirmRequest } from '../backend/apiInterface';
import { TOKEN_KEY, VERIFIER_KEY } from '../util/constants';

export default class Confirm extends Vue {
    message: string = 'Confirming...'

    async mounted(): Promise<void> {
        const code = useRoute().query.code as string;
        const verifier = window.localStorage.getItem(VERIFIER_KEY);
        debugger;

        if(!verifier) {
            this.message = 'ERROR, could not get verifier from local storage';
            return;
        }

        let response = await authConfirm(new OauthConfirmRequest({
            code: code,
            verifier: verifier
        }));

        window.localStorage.setItem(TOKEN_KEY, response.idToken);
    }

    private async auth() {
        
    }

}

</script>