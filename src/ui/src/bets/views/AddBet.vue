<template>
    <section>
        <BackButton></BackButton>
        <h2>Create Custom Bet</h2>
        <form>
            <label>Group<span class="required">*</span></label>
            <select v-if="groups.length > 0"
                    v-model="bet.group"
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
            <select v-model="betPrediction.prediction">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
            </select>
            <label>Wager<span class="required">*</span></label>
            <input type="number" 
                   v-model="betPrediction.wager"
                   required />
            <button @click="addBet()">create</button>
        </form>
    </section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Bet, DateBet, EventBet } from '../bets.models'
import { Store } from '../../app.store';
import { BetsActions } from '../bets.store';
import { Group } from '@/groups/models';
import { GroupsActions } from '@/groups/groups.store';

class AddingBet {
    id: string;
    title: string;
    description: string;
    closeDate: Date;
    amount: number;
    group?: Group;

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

interface BetPrediction {
    prediction: boolean,
    wager: number
}

export default class AddBet extends Vue {
    baseBet = new AddingBet();
    possibleBets: Bet[] = [
        new AddingEventBet(this.baseBet)
        // new AddingDateBet(this.baseBet)
    ];
    bet: Bet = this.possibleBets[0];
    groups: Group[] = [];
    betPrediction: BetPrediction = {
        prediction: true,
        wager: 0
    };

    typeOptions: string[] = (this.possibleBets || []).map(x => x.type);

    async created() {
        const store: Store = this.$store;
        await store.dispatch(GroupsActions.FETCH_GROUPS);
        this.groups = store.getters.getGroups || [];
        
        const groupId = this.$route.query.groupId;
        if(groupId)
            this.bet.group = this.groups.find(x => x.id == groupId);
    }

    onSelectionChanged(event: Event): void {
        this.bet = this.possibleBets.find(x => 
                x.type === (event.target as HTMLInputElement).value) 
            || this.possibleBets[0];
    }

    async addBet(): Promise<void> {
        const store: Store = this.$store;
        await store.dispatch(BetsActions.CREATE_BET, {
            bet: this.bet, 
            ...this.betPrediction
        });
        const betId = store.getters.getBet?.id;
        if(betId)
            this.$router.push({ name: 'Bet', params: { id: betId }});
        else
            throw new Error('Bet does not exist');
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