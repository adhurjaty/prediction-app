<template>
    <div class="container">
        <h1>Contract Controls</h1>
        <div>
            <button @click="deploy">Deploy Contract</button>
            <span>{{ proposition?.address || "" }}</span>
        </div>
        <div>
            <button @click="addMember">Add Member</button>
            <input v-model="memberInput" />
        </div>
        <div>
            <button @click="makeWager">Wager</button>
            <span v-if="wager !== null">{{ wager }}</span>
        </div>
        <div>
            <button @click="getBet">Get My Bet</button>
            <span v-if="bet !== null">{{ bet }}</span>
        </div>
        <div>
            <button @click="getPool">Pool</button>
            <span v-if="pool !== null">{{ pool }}</span>
        </div>
        <div>
            <button @click="getTitle">Title</button>
            <span v-if="title">{{ title }}</span>
        </div>
    </div>
</template>


<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ethers } from 'ethers';
import { Proposition } from '../types/ethers-contracts/Proposition';
import { Proposition__factory } from '../types/ethers-contracts/factories/Proposition__factory';

const DEFAULT_CONTRACT = "0x1E260ea8D1721de8667fc9EEa021e0503f5D7000";

declare global {
    interface Window {
        ethereum:any;
    }
}

@Options({
    props: {

    }
})


export default class ContractControl extends Vue {
    memberInput: string = "";
    wager: number | null = null;
    bet: number | null = null;
    pool: number | null = null;
    title: string = "";
    proposition: Proposition | null = null;

    async deploy() {
        await window.ethereum.enable()
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner();

        const factory = new Proposition__factory(signer);
        this.proposition = await factory.deploy();
    }

    async addMember() : Promise<void> {
        this.memberInput = "";
    }

    async makeWager() : Promise<void> {
        if(!this.proposition) {
            this.proposition = await this.createExistingContract();
        }

        const result = await this.proposition['addBet(uint256)'](1);
        console.log(result);
    }

    async getBet() : Promise<void> {
        if(!this.proposition) {
            this.proposition = await this.createExistingContract();
        }

        const result = await this.proposition['getMyWager()']();
        const ethString = ethers.utils.formatEther(result);
        this.bet = parseFloat(ethString);
    }

    async getPool() : Promise<void> {
        if(!this.proposition) {
            this.proposition = await this.createExistingContract();
        }

        const result = await this.proposition['wager_pool()']();
        const ethString = ethers.utils.formatEther(result);
        this.pool = parseFloat(ethString);
    }

    getTitle() : void {
        this.title = "Proposition";
    }

    doNothing() : void {
        console.log("here");
    }

    private async createExistingContract() : Promise<Proposition> {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return Proposition__factory.connect(DEFAULT_CONTRACT, signer);
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
