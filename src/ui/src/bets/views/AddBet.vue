<template>
    <section>
        <BackButton></BackButton>
        <h2>Create Custom Bet</h2>
        <form>
            <label>Title<span class="required">*</span></label>
            <input type="text" placeholder="Title" required />
            <label>Description<span class="required">*</span></label>
            <textarea rows="6" placeholder="Enter description" required></textarea>
            <label>Resolution Type<span class="required">*</span></label>
            <select required v-model="resolutionType">
                <option value="" disabled selected>choose a type</option>
                <option value="date">Date</option>
                <option value="event">Event</option>
            </select>
            <input v-if="resolutionType === 'date'" type="date" required />
            <input v-if="resolutionType === 'event'" type="text" placeholder="describe triggering event" required />
            <label>Close Date<span class="required">*</span></label>
            <p>No one will be able to bet on this after this date has passed</p>
            <input type="datetime-local" required />
            <label>Stake</label>
            <p>Stakes will be proposed to you by group members</p>
            <button @click="addBet()">create</button>
        </form>
    </section>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class AddBet extends Vue {
    //members: Array<Member> = [{id: 0, name: 'ima_speak_the_sooth', accuracy: 100, prestige: 2},{id: 1, name: 'crystal_deez_nuts', accuracy: 0, prestige: -1},{id: 1, name: 'oracle69', accuracy: 0, prestige: -1}]
    resolutionType: string = '';
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