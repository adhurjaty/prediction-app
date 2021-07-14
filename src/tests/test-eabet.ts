import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("EqualAnteBet", function () {
    let commissioner: Signer, member1: Signer, member2: Signer, nonmember1: Signer;
    let betFactory: ContractFactory;
    let bet: Contract;

    beforeEach(async function () {
        betFactory = await ethers.getContractFactory("EqualAnteBet");
        [commissioner, member1, member2, nonmember1] = await ethers.getSigners();

        const date = Date.now();

        bet = await betFactory.deploy("Test Bet" + date, date+360, date+720);
        await bet.connect(commissioner).addMember(await member1.getAddress());
    });

    it("Should allow a member to wager exactly 1", async function () { 
        bet.connect(member1).wager({value: 1});
        expect(await bet.connect(member1).getMyWager()).to.equal(1);
    });

    it("Should prevent a member from wagering more than 1", async function () { 
        await(expect(bet.connect(member1).wager({value: 100})).to.be.reverted);
    });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });

});