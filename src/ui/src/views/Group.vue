<template>
<main>
    <BackButton></BackButton>
    <div class="group-name">
        <div class="group-icon" :style="`background:${group[$route.params.id].color}`"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20"><path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z"/></svg></div>
        <h2 :style="`color:${group[$route.params.id].color}`">{{ group[$route.params.id].title }}</h2>
    </div>
    <h3>Active Bets</h3>
    <p v-if="bets.length === 0">No bets have been added</p>
    <div v-if="bets.length > 0">
        <div v-for="bet in bets" :key="bet.id">
            <div class="bet" v-bind:class="{ 'even': index%2 !== 0 }">
                <div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17 12c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm.5 8.474v.526h-.5v-.499c-.518-.009-1.053-.132-1.5-.363l.228-.822c.478.186 1.114.383 1.612.27.574-.13.692-.721.057-1.005-.465-.217-1.889-.402-1.889-1.622 0-.681.52-1.292 1.492-1.425v-.534h.5v.509c.362.01.768.073 1.221.21l-.181.824c-.384-.135-.808-.257-1.222-.232-.744.043-.81.688-.29.958.856.402 1.972.7 1.972 1.773.001.858-.672 1.315-1.5 1.432zm1.624-10.179c1.132-.223 2.162-.626 2.876-1.197v.652c0 .499-.386.955-1.007 1.328-.581-.337-1.208-.6-1.869-.783zm-2.124-5.795c2.673 0 5-1.007 5-2.25s-2.327-2.25-5-2.25c-2.672 0-5 1.007-5 2.25s2.328 2.25 5 2.25zm.093-2.009c-.299-.09-1.214-.166-1.214-.675 0-.284.334-.537.958-.593v-.223h.321v.211c.234.005.494.03.784.09l-.116.342c-.221-.051-.467-.099-.708-.099l-.072.001c-.482.02-.521.287-.188.399.547.169 1.267.292 1.267.74 0 .357-.434.548-.967.596v.22h-.321v-.208c-.328-.003-.676-.056-.962-.152l.147-.343c.244.063.552.126.828.126l.208-.014c.369-.053.443-.3.035-.418zm-11.093 13.009c1.445 0 2.775-.301 3.705-.768.311-.69.714-1.329 1.198-1.899-.451-1.043-2.539-1.833-4.903-1.833-2.672 0-5 1.007-5 2.25s2.328 2.25 5 2.25zm.093-2.009c-.299-.09-1.214-.166-1.214-.675 0-.284.335-.537.958-.593v-.223h.321v.211c.234.005.494.03.784.09l-.117.342c-.22-.051-.466-.099-.707-.099l-.072.001c-.482.02-.52.287-.188.399.547.169 1.267.292 1.267.74 0 .357-.434.548-.967.596v.22h-.321v-.208c-.329-.003-.676-.056-.962-.152l.147-.343c.244.063.552.126.828.126l.208-.014c.368-.053.443-.3.035-.418zm4.003 8.531c-.919.59-2.44.978-4.096.978-2.672 0-5-1.007-5-2.25v-.652c1.146.918 3.109 1.402 5 1.402 1.236 0 2.499-.211 3.549-.611.153.394.336.773.547 1.133zm-9.096-3.772v-.651c1.146.917 3.109 1.401 5 1.401 1.039 0 2.094-.151 3.028-.435.033.469.107.926.218 1.37-.888.347-2.024.565-3.246.565-2.672 0-5-1.007-5-2.25zm0-2.5v-.652c1.146.918 3.109 1.402 5 1.402 1.127 0 2.275-.176 3.266-.509-.128.493-.21 1.002-.241 1.526-.854.298-1.903.483-3.025.483-2.672 0-5-1.007-5-2.25zm11-11v-.652c1.146.918 3.109 1.402 5 1.402 1.892 0 3.854-.484 5-1.402v.652c0 1.243-2.327 2.25-5 2.25-2.672 0-5-1.007-5-2.25zm0 5v-.652c.713.571 1.744.974 2.876 1.197-.661.183-1.287.446-1.868.783-.622-.373-1.008-.829-1.008-1.328zm0-2.5v-.651c1.146.917 3.109 1.401 5 1.401 1.892 0 3.854-.484 5-1.401v.651c0 1.243-2.327 2.25-5 2.25-2.672 0-5-1.007-5-2.25z"/></svg></div>
                <div>
                    <p class="title">{{ bet.title }}</p>
                    <p class="status" v-bind:class="{'no-bet': bet.stake === 0}">{{ betMade(bet.stake, bet.status) }}</p>
                </div>
            </div>
        </div>
    </div>
    <router-link :to="{ name: 'Add Bet', params: {groupId: $route.params.id} }">
        <button>+ bet</button>
    </router-link>
    <h3>Leaderboard</h3>
    <p v-if="members.length === 0">You are the only one here. Add some members to get started.</p>
    <div class="leaderboard-table" v-if="members.length > 0">
        <table>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Accuracy</th>
                    <th>+/- Prestige</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="member in members" :key="member.id">
                    <td>{{ member.name }}</td>
                    <td>{{ member.accuracy }}</td>
                    <td>{{ member.prestige }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <router-link :to="{ name: 'Add Members', params: {groupId: $route.params.id} }">
        <button>+ members</button>
    </router-link>
    <div class="bottom-buttons">
        <div>
            <img src="../assets/addBet.svg" />
            <p>add bet</p>
        </div>
        <div>
            <img src="../assets/addMember.svg" />
            <p>add members</p>
        </div>
    </div>
</main>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

interface Bet {
    id: number
    title: string
    stake: number
    status: string
}

interface Member {
    id: number
    name: string
    accuracy: number
    prestige: number
}

export default class GroupInfo extends Vue {
    group: Object = {1: {title: 'Sooth Sayans', color:'#B644BE'}, 2: {title: 'Big Flexors', color:'#EB0101'}}
    bets: Array<Bet> = []
    //bets: Array<Bet> = [{id: 0, title:'How much wood would a wood chuck chuck?', stake: 0, status: 'none'},{id: 1, title:'Will Lebron have 7 rings by the time he retires',stake: 1, status: 'Yes'}]
    members: Array<Member> = []
    //members: Array<Member> = [{id: 0, name: 'ima_speak_the_sooth', accuracy: 100, prestige: 2},{id: 1, name: 'crystal_deez_nuts', accuracy: 0, prestige: -1},{id: 1, name: 'oracle69', accuracy: 0, prestige: -1}]
    betMade(stake: number, status: string): string {
        return stake > 0 ? `you have bet ${stake} prestige point on ${status}` : 'you have not bet'  
    }
}
</script>

<style lang="scss" scoped>
    main {
        margin-top: 66px;
        height: calc(100vh - 128px);
        overflow: auto;
    }

    .group-name {
        display: flex;

        .group-icon {
            border-radius: 99px;
            //background: #B644BE;
            margin-right: 10px;
        }

        svg {
            height: 40px;
            width: auto;
            padding: 15px;
            fill: #212121;
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
    
    .back {
        @include back();
    }
</style>