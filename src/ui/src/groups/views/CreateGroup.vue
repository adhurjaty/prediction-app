<template>
    <section>
        <BackButton></BackButton>
        <h2>Create New Group</h2>
        <input type="text" placeholder="Group name" v-model="group.name" />
        <button @click="createGroup()">create</button>
    </section>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { Group } from "../models";
import { GroupsActions } from "../groups.store";
import { Store } from "../../app.store";

export default class GroupCreator extends Vue {
    group: Group = new Group();

    async createGroup() {

        // API call to create group
        // also store a random color?
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        try {
            const store: Store = this.$store;
            await store.dispatch(GroupsActions.CREATE_GROUP, this.group);
            const newGroup = store.getters.getGroup;
            this.$router.push({
                name: 'Group', 
                params : {
                    id: newGroup!.id
                }
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