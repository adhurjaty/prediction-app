<template>
    <section>
        <BackButton></BackButton>
        <h2>Create Custom Bet</h2>
        <form>
            <label>Group<span class="required">*</span></label>
            <select v-if="groups.length > 0"
                    v-model="selectedGroup"
                    required>
                <option v-for="group in groups"
                        :key="group.id"
                        :value="group">
                    {{group.name}}
                </option>
            </select>
            <label>Title<span class="required">*</span></label>
            <input type="text" 
                   placeholder="Title" 
                   v-model="bet.title"
                   required />
            <label>Description<span class="required">*</span></label>
            <textarea rows="6" 
                      placeholder="Enter description"
                      v-model="bet.description"
                      required>
            </textarea>
            <label>Resolution Type<span class="required">*</span></label>
            <select v-model="bet.type"
                    @change="onSelectionChanged($event)"
                    required>
                <option v-for="option in typeOptions" 
                        :key="option"
                        :value="option">
                    {{option}}
                </option>
            </select>
            <input v-if="bet.type === 'date'" 
                   type="date" 
                   required />
            <input v-if="bet.type === 'event'" 
                   type="text" 
                   placeholder="describe triggering event" 
                   required />
            <label>Close Date<span class="required">*</span></label>
            <p>No one will be able to bet on this after this date has passed</p>
            <input type="datetime-local"
                   v-model="bet.closeDate"
                   required />
            <label>Prediction<span class="required">*</span></label>
            <select v-model="wager.prediction">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
            </select>
            <label>Wager<span class="required">*</span></label>
            <input type="number" 
                   v-model="wager.wager"
                   required />
            <button @click="addBet()">create</button>
        </form>
    </section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Bet, DateBet, EventBet, Wager } from '../bets.models'
import { Store } from '../../app.store';
import { BetsActions } from '../bets.store';
import { Group } from '@/groups/models';
import { GroupsActions } from '@/groups/groups.store';
import GroupPage from '@/groups/views/GroupsList.vue';
import User from '@/models/user';
import { UsersActions } from '@/users/users.store';

class AddingBet {
    id: string;
    title: string;
    description: string;
    closeDate: Date;
    amount: number;

    constructor(bet?: AddingBet) {
        this.title = bet?.title || '';
        this.description = bet?.description || '';
        // set default close date to 2 weeks in the future
        this.closeDate = bet?.closeDate || new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 14));
        this.amount = bet?.amount || 0;
    }
}

class AddingEventBet extends AddingBet implements EventBet {
    type: string = 'event'
    resolutionDescription: string;

    constructor(private bet: AddingBet) {
        super(bet);
    }
}

class AddingDateBet extends AddingBet implements DateBet {
    type: string = 'date'
    resolveDate: Date;

    constructor(private bet: AddingBet) {
        super(bet);
    }
}

export default class AddBet extends Vue {
    baseBet = new AddingBet();
    possibleBets: Bet[] = [
        new AddingEventBet(this.baseBet)
        // new AddingDateBet(this.baseBet)
    ];
    user?: User;
    bet: Bet = this.possibleBets[0];
    groups: Group[] = [];
    selectedGroup?: Group
    wager: Wager = {
        betId: '',
        userId: '',
        prediction: true,
        wager: 0
    };

    typeOptions: string[] = (this.possibleBets || []).map(x => x.type);

    async created() {
        const store: Store = this.$store;
        await Promise.all([
            store.dispatch(GroupsActions.FETCH_GROUPS),
            store.dispatch(UsersActions.FETCH_USER)
        ]);
        this.groups = store.getters.getGroups || [];
        this.user = store.getters.getUser || undefined;

        if(!this.user)
            throw new Error("Error getting user");
        
        const groupId = this.$route.query.groupId;
        if(groupId)
            this.selectedGroup = this.groups.find(x => x.id == groupId);
    }

    onSelectionChanged(event: Event): void {
        this.bet = this.possibleBets.find(x => 
                x.type === (event.target as HTMLInputElement).value) 
            || this.possibleBets[0];
    }

    async addBet(): Promise<void> {
        const groupId = this.selectedGroup?.id;

        if(!groupId)
            throw new Error("No group selected");

        const store: Store = this.$store;
        await store.dispatch(BetsActions.CREATE_BET, {
            ...this.bet,
            groupId
        });

        const betId = store.getters.getBet?.id;
        const userId = store.getters.getUser?.id;
        
        if(!userId)
            throw new Error("Error getting user");
        if(!betId)
            throw new Error("Error creating bet");

        this.wager = {
            ...this.wager,
            betId,
            userId
        };
        await store.dispatch(BetsActions.PLACE_WAGER, this.wager);
        this.$router.push({ name: 'Bet', params: { id: groupId, betId: betId }});
    }
}
</script>

<style lang="scss" scoped>
    label {
        font-size: 20px;
        margin: 5px 0;
        display: block;

        + p {
            margin-top: 0;
        }
    }

    .required {
        color: red;
    }

    textarea {
        display: block;
        margin-bottom: 30px;
        width: calc(100% - 20px);
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-size: 18px;
        padding: 5px 5px;
        resize: none;
        padding-left: 10px;
    }

    select {
        display: block;
        height: 40px;
        margin-bottom: 30px;
        width: 100%;
        font-size: 18px;
        color: #757575;
        padding-left: 10px;
        text-transform: capitalize;
    }

    h2 {
        margin-bottom: 15px;
        font-size: 28px;
    }

    input {
        @include input;
    }

    button {
        @include button;
    }
</style>