<template>
    <main>
        <BackButton></BackButton>
        <h2>Add to {{ group[$route.params.groupId].title }}</h2>
        <div class="invite">
            <img src="../assets/addMember.svg" />
            <p>Invite friends</p>
        </div>
        <h3>Friends</h3>
        <Friend v-for="friend in friends" :key="friend.id" :name="friend.name" :id="friend.id" @updateState="updateFriendStates($event, friend.id)"></Friend>
        <button :disabled="!friendActive" class="send">send invites</button>
    </main>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

interface Friend {
    id: number
    name: string
}

export default class AddMember extends Vue {
    group: Object = {1: {title: 'Sooth Sayans', color:'#B644BE'}, 2: {title: 'Big Flexors', color:'#EB0101'}};
    friends: Array<Friend> = [{id: 0, name: 'ima_speak_the_sooth'},{id: 1, name:'crystal_deez_nuts'}];
    friendStates: Array<boolean> = [...Array(this.friends.length).fill(false)];
    friendActive: boolean = false;
    updateFriendStates(val: boolean, id: number): void {
        this.friendStates[id] = val;
        this.friendActive = this.friendStates.includes(true) ? true : false;
    }
}
</script>

<style lang="scss" scoped>
    main {
        margin-top: 66px;
        height: calc(100vh + 120px);
        overflow: auto;
    }

    h2 {
        margin-top: 0;
        font-size: 28px;
    }

    h3 {
        font-size: 24px;
    }

    .invite {
        display: flex;

        img {
            margin-right: 10px;
        }

        p {
            font-size: 20px;
        }
    }

    .friend {
        display: flex;
        margin-bottom: 20px;
    }

    .circle {
        text-transform: uppercase;
        height: 50px;
        width: 50px;
        background: #999999;
        display: grid;
        place-content: center;
        border-radius: 99px;
        font-size: 40px;
        overflow: hidden;
        color: #eee;
        margin-right: 10px;

        p {
            font-size: 18px;
        }
    }

    .send {
        border: none;
        padding: 10px;
        background: #3ab154;
        color: white;
        font-size: 18px;
        transition: background .5s;

        &:disabled {
            color: #727272;
            background: #dadada;
        }
    }
</style>