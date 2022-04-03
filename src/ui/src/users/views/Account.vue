<template>
    <section>
        <h2>Account Info</h2>
        <div>Email: {{user.email}}</div>
        <input type="text" v-model="user.displayName" placeholder="Display name" />
        <button @click="saveAccount()">save</button>
    </section>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Store } from '@/app.store';
import User from "@/models/user";
import { UsersActions } from "../users.store";

export default class Account extends Vue {
    user: User = new User();

    async created() {
        const store: Store = this.$store;
        await store.dispatch(UsersActions.FETCH_FULL_USER);
        this.user = store.getters.getUser || new User();
    }

    async saveAccount(): Promise<void> {
        const store: Store = this.$store;
        await store.dispatch(UsersActions.UPDATE_USER, this.user);
        var updatedUser = store.getters.getUser;
        if(updatedUser)
            console.log('Saved successful');
        else
            throw new Error('Failed to update user');
    }
}
</script>

<style lang="scss" scoped>
    input {
        @include input;
    }

    button {
        @include button;
    }
</style>