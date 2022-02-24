<template>
<section>
    <BackButton></BackButton>
    <div class="group-name" v-if="bet.group">
        <div>Group: </div>
        <div>{{ bet.group.name }}</div>
    </div>
    <div class="bet-name">
        <div class="bet-icon circle">
            <div class="circle-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></svg>
            </div>
        </div>
        <h2>{{ bet.title }}</h2>
    </div>
    <div>{{bet.description}}</div>

    <h3>Members</h3>
    <p v-if="bet.group.users.length === 0">No one is in the group!</p>
    <div v-if="bet.group.users.length > 0">
        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Bet</th>
                    <th>Resolution vote</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="member in bet.group.users" :key="member.id">
                    <td>{{ member.displayName }}</td>
                    <td>{{ member.accuracy }}</td>
                    <td>{{ member.prestige }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="bottom-buttons">
        <div>
            <router-link :to="{ name: 'Add Bet', params: { query: { groupId: $route.params.id} } }">
                <img src="../../assets/addBet.svg" />
                <p>add bet</p>
            </router-link>
        </div>
    </div>
    <form>
        <label>Prediction<span class="required">*</span></label>
        <select v-model="betPrediction.prediction">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
        </select>
        <label>Wager<span class="required">*</span></label>
        <input type="number" 
               v-model="betPrediction.wager"
               required />
        <button @click="placeWager()">Place wager</button>
        
    </form>
</section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Bet } from '../bets.models';
import { BetsActions } from '../bets.store';
import { Store } from '../../app.store';
import { Group } from '@/groups/models';

const defaultBet : () => Bet = () => {
    return {
        id: '',
        type: '',
        title: '',
        description: '',
        closeDate: new Date(),
        amount: 0,
        group: new Group()
    }
}

export default class betInfo extends Vue {
    bet: Bet = defaultBet();
    bets: Bet[] = [];
    betPrediction: BetPrediction = {
        prediction: true,
        wager: 0
    };

    betMade(stake: number, status: string): string {
        return stake > 0 ? `you have bet ${stake} prestige point on ${status}` : 'you have not bet';
    }

    async created() {
        const store: Store = this.$store;
        await store.dispatch(BetsActions.FETCH_BET, this.$route.params.betId as string);
        this.bet = store.getters.getBet || defaultBet();
    }

    async placeWager(): Promise<void> {
        const store: Store = this.$store;
        await store.dispatch(BetsActions.CREATE_BET, this.bet);
        const betId = store.getters.getBet?.id;
        if(betId)
            this.$router.push({ name: 'Bet', params: { id: betId }});
        else
            throw new Error('Bet does not exist');
    }
}
</script>

<style lang="scss" scoped>
    .bet-name {
        @include iconWithData;

        margin-bottom: 0;

        h2 {
            margin-top: 7px;
        }

        .circle svg {
            height: 40px;
        }
    }

    .bet {
        display: flex;
        margin-bottom: 20px;

        .icon {
            border-radius: 99px;
            background: #D0F5D8;
            height: 45px;
            width: 50px;
            display: grid;
            place-content: center;
            padding: 10px;
            margin-right: 10px;
        }

        svg {
            width: 40px;
            height: auto;
            fill: #3AB154;
        }

        .title {
            font-size: 19px;
            margin: 0;
        }

        .status {
            color: #3AB154;
            margin: 0;

            &.no-bet {
                color: #B5A305;
            }
        }
    }

    .leaderboard-table {
        overflow: auto;
        margin-bottom: 20px;
    }

    th {
        text-align: left;
        background: #3ab154;
        padding: 5px 7px;
        color: white;
        font-weight: normal;
        font-size: 17px;
    }

    td {
        background: #eee;
        padding: 5px 7px;
    }

    h2 {
        font-size: 28px;
        color: #B644BE;
    }

    h3 {
        margin-bottom: 10px;
        font-size: 24px;
    }

    p {
        font-size: 17px;
    }

    button {
        @include button;
    }

    .bottom-buttons {
        position: fixed;
        bottom: 0;
        z-index: 999;
        width: 100vw;
        background: white;
        height: 83px;
        display: grid;
        grid-template-columns: 50% 50%;
        text-align: center;
        left: 0;

        p {
            margin: 0;
            color: #3ab154;
        }
    }

    .group-name {
        display: flex;
        flex-direction: row;
    }
</style>