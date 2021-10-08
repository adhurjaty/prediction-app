<template>
    <section>
        <router-link to="/groups">
            <div class="back">
                <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.939339 10.9042C0.353554 11.49 0.353554 12.4398 0.939339 13.0256L10.4853 22.5715C11.0711 23.1573 12.0208 23.1573 12.6066 22.5715C13.1924 21.9857 13.1924 21.036 12.6066 20.4502L4.12132 11.9649L12.6066 3.47962C13.1924 2.89384 13.1924 1.94409 12.6066 1.3583C12.0208 0.772516 11.0711 0.772516 10.4853 1.3583L0.939339 10.9042ZM33 10.4649L2 10.4649V13.4649L33 13.4649V10.4649Z" fill="white"/></svg>
            </div>
        </router-link>
        <h2>Create New Group</h2>
        <input type="text" placeholder="Group name" v-model="group.name" />
        <button @click="createGroup()">create</button>
    </section>
</template>

<script lang="ts">
import { inject } from "inversify-props";
import { Vue } from "vue-class-component";
import { Group } from "../models";
import { ICreateGroupCommand } from '../commands/createGroupCommand';
import { authorize } from "../../util/decorators";

export default class GroupCreator extends Vue {
    @inject() createGroupCommand: ICreateGroupCommand;

    group: Group = new Group();

    @authorize
    created() {}

    async createGroup() {

        // API call to create group
        // also store a random color?
        const randomColor = Math.floor(Math.random()*16777215).toString(16);

        try {
            var newGroup = await this.createGroupCommand.execute(this.group);
            this.$router.push({
                name: 'Group', 
                params : {
                    id: newGroup.id
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