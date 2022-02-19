<template>
    <section v-bind:class="{ 'empty': bets.length === 0 }">
        <div class="no-bets" v-if="bets.length === 0">
            <h2>All bets are off here. Create one</h2>
        </div>
        <div class="bets" v-if="bets.length > 0">
            <div v-for="bet in bets" :key="bet.title">
                <router-link :to="{ name: 'Bet', params: {betId: bet.id } }" class="bet">
                    <div class="circle">
                        <div class="circle-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></svg>
                        </div>
                    </div>
                    <div class="text-info">
                        <p class="title">{{ bet.title }}</p>
                    </div>
                </router-link>
            </div>
        </div>
        <!-- <router-link :to="{ name: 'Add Bet'}">
            <button>+ bet</button>
        </router-link> -->
    </section>
</template>

<script lang="ts">
import { Store } from '@/app.store';
import { Vue } from 'vue-class-component';
import { BetsActions } from '../bets.store';
import { Bet } from '../bets.models';

export default class GroupPage extends Vue {
    bets: Bet[] = [];

    async created(): Promise<void> {
        const store: Store = this.$store;
        await store.dispatch(BetsActions.FETCH_BETS);
        this.bets = store.getters.getBets;
    }
}
</script>


<style lang="scss" scoped>
    .no-bets {
        text-align: center;
    }

    .bet {
        @include iconWithData;

        .title {
            font-weight: bold;
            color: $purple-title;
        }

        .circle svg {
            width: 40px;
        }
    }

    button {
        @include button;
        margin: 0 auto;
        display: block;
    }
</style>