<template>
    <section>
        <BackButton></BackButton>
        <h2>Create Account</h2>
        <input type="text" placeholder="User Name" v-model="user.displayName" />
        <input type="text" placeholder="Email" v-model="user.email" />
        <button @click="createUser()">create</button>
    </section>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import User from "../../models/user";
import { UsersActions } from "../users.store";
import { Store } from "../../app.store";

export default class UserCreator extends Vue {
    user: User = new User();

    async createUser() {

        // API call to create user

        try {
            const store: Store = this.$store;
            await store.dispatch(UsersActions.CREATE_USER, this.user);
            this.$router.push({
                name: 'Groups'
            });
        } catch (error) {
            debugger;
            console.log(error);
        }
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