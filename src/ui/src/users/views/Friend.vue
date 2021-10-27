<template>
<section>
    <BackButton />
    <div v-if="!!friend?.displayName">
        <h3>{{friend.displayName}}</h3>
    </div>
    <div v-else>
        Loading...
    </div>
</section>
</template>

<script lang="ts">
import { Store } from "@/app.store";
import User from "@/models/user";
import { Vue } from "vue-class-component";
import { UsersActions } from "../users.store";


export default class Friend extends Vue {
    friend: User = new User()

    async created() {
        const store: Store = this.$store;
        await store.dispatch(UsersActions.FETCH_FULL_USER);
        this.friend = store.getters.getUser?.friends
            ?.find(x => x.id == this.$route.params.id) 
            || new User();
    }
}

</script>