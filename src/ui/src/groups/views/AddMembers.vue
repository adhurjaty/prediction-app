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
                <Friend v-for="friend in friends" :key="friend.id" :name="friend.displayName" :id="friend.id" @updateState="updateFriendStates($event, friend.id)"></Friend>
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
import { inject } from 'inversify-props';
import { Options, Vue } from 'vue-class-component';
import { Group } from '../models';
import { IGroupQuery } from '../queries/groupQuery';
import { authorize } from '../../util/decorators';

interface Friend {
    id: string
    displayName: string
}

@Options({
    props: {
        groupProp: {
            required: false,
            type: [Object, null]
        }
    }
})
export default class AddMember extends Vue {
    @inject() private groupQuery!: IGroupQuery;
    groupProp: Group | null;
    group: Group | null = null;
    allFriends: Array<Friend> = [{id: 'b0d20f6a-5cfd-4e92-96eb-9b0e694f285f', displayName: 'Anil Dhurjaty'},{id: '359f531c-8b67-45a2-82ee-2118759f0e09', displayName:'Tony Wong'}]; // replace with api call
    friends: Array<Friend> = [];
    friendStates: Array<boolean>  = new Array(this.friends.length).fill(false);
    friendActive: boolean = false;

    updateFriendStates(val: boolean, id: string): void {
        let index = this.friends.map(x => x.id).indexOf(id);
        this.friendStates[index] = val;
        this.friendActive = this.friendStates.includes(true) ? true : false;
    }

    @authorize
    async created() {
        this.group = this.groupProp;
        if(!this.group) {
            this.group = await this.groupQuery.query(this.$route.params.id as string);
        }
        const group = this.group as Group;
        this.friends = this.allFriends.filter(user => !group.users.map(x => x.displayName).includes(user.displayName));
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