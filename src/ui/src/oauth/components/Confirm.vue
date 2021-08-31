<template>
    <div>
        {{ message }}
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRoute } from "vue-router";
import { authConfirm, OauthConfirmRequest } from '../../backend/apiInterface';
import { TOKEN_KEY, VERIFIER_KEY } from '../../util/constants';

export default class Confirm extends Vue {
    message: string = 'Confirming...'

    async mounted(): Promise<void> {
        const query = useRoute().query;
        const code = query.code as string;
        const state = query.state as string;
        const stateParams = new URLSearchParams(state);
        const origin = stateParams.get('origin');
        const verifier = window.localStorage.getItem(VERIFIER_KEY);

        if(!verifier) {
            this.message = 'ERROR, could not get verifier from local storage';
            return;
        }

        let response = await authConfirm(new OauthConfirmRequest({
            code: code,
            verifier: verifier
        }));

        window.localStorage.setItem(TOKEN_KEY, response.idToken);
        if(origin) {
            window.location.href = origin;
        }
    }

    private async auth() {
        
    }

}

</script>