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
    <div v-if="!group">Loading...</div>
    <div v-else-if="group.users.length === 0">No one is in the group!</div>
    <div v-else>
        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Bet</th>
                    <th>Resolution vote</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="member in group.users" :key="member.id">
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
        <div v-if="existingUserWager">
            You've already made a prediction
        </div>
        <div v-else-if="hasBetClosed">
            Bet is closed
        </div>
        <div v-else>
            <h3>Place Wager</h3>
            <label>Prediction<span class="required">*</span></label>
            <select v-model="userWager.prediction">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
            </select>
            <label>Wager<span class="required">*</span></label>
            <input type="number" 
                v-model="userWager.wager"
                required />
            <button @click="placeWager()">Place wager</button>
        </div>
        <div v-if="hasResolutionVote">
            You've already voted to resolve
        </div>
        <div v-else-if="!hasBetClosed">
            Bet is still open
        </div>
        <div v-else>
            <h3>Vote to resolve</h3>
            <label>Resolution vote<span class="required">*</span></label>
            <select v-model="userResolution.vote">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
            </select>
            <button @click="placeWager()">Place wager</button>
        </div>
    </form>
</section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Bet, Resolution, ResolutionResults, Wager } from '../bets.models';
import { BetsActions } from '../bets.store';
import { Store } from '../../app.store';
import { Group } from '@/groups/models';
import User from '@/models/user';
import { UsersActions } from '@/users/users.store';
import { GroupsActions } from '@/groups/groups.store';

interface WagerToPlace {
    wager: number,
    prediction: boolean
}

interface ResolutionToPlace {
    vote: boolean
}

export default class BetInfo extends Vue {
    user?: User;
    group?: Group;
    bet?: Bet;
    existingWagers: Wager[] = [];
    resolutionResults?: ResolutionResults;
    hasResolutionVote: boolean = false;
    userWager: WagerToPlace = {
        wager: 0,
        prediction: true
    };
    userResolution: ResolutionToPlace = {
        vote: true
    };

    get hasBetClosed(): boolean {
        const now = new Date();
        return !!this.bet && this.bet?.closeDate < now;
    }

    get existingUserWager(): Wager | undefined {
        return this.getWager(this.user?.id ?? '');
    }

    async created() {
        const store: Store = this.$store;
        const groupId = this.$route.params.id as string;
        const betId = this.$route.params.betId as string;
        await Promise.all([
            store.dispatch(UsersActions.FETCH_USER),
            store.dispatch(GroupsActions.FETCH_GROUP, groupId),
            store.dispatch(BetsActions.FETCH_BET, betId),
            store.dispatch(BetsActions.FETCH_WAGERS, betId),
            store.dispatch(BetsActions.FETCH_RESOLUTION_RESULTS, betId),
        ]);
        this.user = store.getters.getUser || undefined;
        this.group = store.getters.getGroup || undefined;
        this.bet = store.getters.getBet || undefined;
        this.existingWagers = store.getters.getWagers || [];
        this.resolutionResults = store.getters.getResolutionResults || undefined;

        if(!this.user) 
            throw new Error("Error getting user");
        if(!this.group)
            throw new Error("Error getting group")
        if(!this.bet)
            throw new Error("Error getting bet");

        if(this.hasBetClosed) {
            await store.dispatch(BetsActions.FETCH_CAN_RESOLVE);
            this.hasResolutionVote = store.getters.getCanResolve || false;
        }
    }

    async placeWager(): Promise<void> {
        const store: Store = this.$store;
        const wager = {
            betId: this.bet!.id,
            userId: this.user!.id,
            ...this.userWager!
        }
        await store.dispatch(BetsActions.PLACE_WAGER, wager);
    }

    async placeResolution(): Promise<void> {
        const store: Store = this.$store;
        const betId = this.$route.params.betId as string;
        const resolution = {
            betId: betId,
            userId: this.user!.id,
            ...this.userResolution!
        }
        await store.dispatch(BetsActions.RESOLVE_BET, resolution);
    }

    getWager(userId: string): Wager | undefined {
        return this.user && this.existingWagers?.find(x => x.userId == userId);
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