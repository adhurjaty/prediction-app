<template>
    <section>
        <BackButton></BackButton>
        <div v-if="!group">Loading...</div>
        <div v-if="group">
            <h2>Add to {{ group.name }}</h2>
            <div class="invite">
                <img src="../../assets/addMember.svg" />
                <p>Invite friends</p>
            </div>
            <h3>Friends</h3>
            <div v-if="friends.length > 0">
                <Friend v-for="friend in friends" 
                        :key="friend.id" 
                        :name="friend.displayName" 
                        :id="friend.id" 
                        @updateState="updateFriendStates($event, friend.id)" />
                <button :disabled="!friendActive" class="send">send invites</button>
            </div>
            <div v-if="friends.length == 0">
                <p>All your current friends are in this group already</p>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import 'reflect-metadata';
import { Vue } from 'vue-class-component';
import { Group } from '../models';
import { GroupsActions } from '../group.store';
import { Store } from '@/app.store';
import { UsersActions } from '@/users/users.store';

interface Friend {
    id: string
    displayName: string
}

export default class AddMember extends Vue {
    group: Group | null = null;
    friends: Array<Friend> = [];
    friendStates: Array<boolean>  = new Array(this.friends.length).fill(false);
    friendActive: boolean = false;

    updateFriendStates(val: boolean, id: string): void {
        let index = this.friends.map(x => x.id).indexOf(id);
        this.friendStates[index] = val;
        this.friendActive = this.friendStates.includes(true) ? true : false;
    }

    async created() {
        const store: Store = this.$store;
        await Promise.all([
            store.dispatch(GroupsActions.FETCH_GROUP, this.$route.params.id as string),
            store.dispatch(UsersActions.FETCH_FULL_USER)
        ]);

        this.group = store.getters.getGroup;
        const user = store.getters.getUser;

        this.friends = (user?.friends || []).filter(user => {
            return !this.group!.users
                .map(x => x.displayName)
                .includes(user.displayName);
        });
    }
}
</script>

<style lang="scss" scoped>
    .invite {
        display: flex;

        img {
            margin-right: 10px;
        }

        p {
            font-size: 20px;
        }
    }

    .send {
        border: none;
        padding: 10px;
        background-color: #3ab154;
        color: white;
        font-size: 18px;
        transition: background-color .5s;

        &:disabled {
            color: #727272;
            background: #dadada;
        }
    }
</style>