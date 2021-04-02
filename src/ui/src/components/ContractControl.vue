<template>
    <div class="container">
        <h1>Contract Controls</h1>
        <div>
            <button @click="addMember">Add Member</button>
            <input v-model="memberInput" />
        </div>
        <div>
            <button @click="makeWager">Wager</button>
            <span v-if="wager >= 0">{{ wager }}</span>
        </div>
        <div>
            <button @click="getBet">Get My Bet</button>
            <span v-if="bet >= 0">{{ bet }}</span>
        </div>
        <div>
            <button @click="getPool">Pool</button>
            <span v-if="pool >= 0">{{ pool }}</span>
        </div>
        <div>
            <button @click="getTitle">Title</button>
            <span v-if="title">{{ title }}</span>
        </div>
    </div>
</template>


<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    props: {

    }
})

export default class ContractControl extends Vue {
    memberInput: string = "";
    wager: number = -1;
    bet: number = -1;
    pool: number = -1;
    title: string = "";

    addMember() {
        this.memberInput = "";
    }

    makeWager() {
        console.log("wager");
    }

    getBet() {
        this.bet = 1;
    }

    getPool() {
        this.pool = 3;
    }

    getTitle() {
        this.title = "Proposition";
    }

    doNothing() {
        console.log("here");
    }
}

</script>

<style scoped>
h1 {
    align-self: center;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

div {
    padding: 10px;
}

span {
    padding-left: 15px;
}

</style>
