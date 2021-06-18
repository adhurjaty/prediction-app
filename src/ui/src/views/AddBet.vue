<template>
    <main>
        <BackButton></BackButton>
        <h2>Create Custom Bet</h2>
        <form>
            <label>Title<span class="required">*</span></label>
            <input type="text" placeholder="Title" required />
            <label>Stake<span class="required">*</span></label>
            <input type="text" placeholder="Stake" required />
            <label>Description<span class="required">*</span></label>
            <textarea class="tall" type="text" placeholder="Enter description" required></textarea>
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
            <button @click="createGroup()">create</button>
        </form>
    </main>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class AddBet extends Vue {
    //members: Array<Member> = [{id: 0, name: 'ima_speak_the_sooth', accuracy: 100, prestige: 2},{id: 1, name: 'crystal_deez_nuts', accuracy: 0, prestige: -1},{id: 1, name: 'oracle69', accuracy: 0, prestige: -1}]
    resolutionType: string = '';
}
</script>

<style lang="scss" scoped>
    main {
        margin-top: 66px;
        height: calc(100vh + 120px);
        overflow: auto;
    }

    label {
        font-size: 20px;
        margin: 5px 0;
        display: block;
    }

    .required {
        color: red;
    }

    .tall {
        height: 10vh;
        min-height: 100px;
        display: block;
        margin-bottom: 30px;
        width: calc(100% - 15px);
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-size: 16px;
        padding: 5px 5px;
        resize: none;
    }

    select {
        display: block;
        height: 40px;
        margin-bottom: 30px;
        width: 100%;
        font-size: 18px;
        color: #757575;
    }

    .back {
        @include back();
    }

    h2 {
        margin-bottom: 15px;
        font-size: 28px;
    }

    input {
        display: block;
        height: 40px;
        margin-bottom: 30px;
        width: calc(100% - 10px);
        font-size: 18px;
    }

    button {
        @include button;
    }
</style>