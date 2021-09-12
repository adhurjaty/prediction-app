<template>
    <section>
        <BackButton></BackButton>
        <h2>Create Custom Bet</h2>
        <form>
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
                        :key="option.key"
                        :value="option.key">
                    {{option.value}}
                </option>
            </select>
            <input v-if="bet.type.toLowerCase() === 'date'" 
                   type="date" 
                   required />
            <input v-if="bet.type.toLowerCase() === 'event'" 
                   type="text" 
                   placeholder="describe triggering event" 
                   required />
            <label>Close Date<span class="required">*</span></label>
            <p>No one will be able to bet on this after this date has passed</p>
            <input type="datetime-local"
                   v-model="bet.closeDate"
                   required />
            <label>Stake</label>
            <p>Stakes will be proposed to you by group members</p>
            <button @click="addBet()">create</button>
        </form>
    </section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Bet, DateBet, EventBet } from '../bets.models'
import { KeyValue } from '../../util/helperTypes'

class AddingBet {
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
    type: string = 'Event'
    resolutionDescription: string;

    constructor(private bet: AddingBet) {
        super(bet);
    }
}

class AddingDateBet extends AddingBet implements DateBet {
    type: string = 'Date'
    resolveDate: Date;

    constructor(private bet: AddingBet) {
        super(bet);
    }
}

export default class AddBet extends Vue {
    possibleBets!: Bet[];
    bet!: Bet;

    public get typeOptions(): KeyValue<string, string>[] {
        return (this.possibleBets || []).map(x => {
            return {
                key: x.type.toLowerCase(),
                value: x.type
            };
        });
    }

    created() {
        const baseBet = new AddingBet();
        this.possibleBets = [
            new AddingEventBet(baseBet),
            new AddingDateBet(baseBet)
        ];
        this.bet = this.possibleBets[0];
    }

    onSelectionChanged(event: Event): void {
        this.bet = this.possibleBets.find(x => 
                x.type.toLowerCase() === (event.target as HTMLInputElement).value) 
            || this.possibleBets[0];
        debugger;
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