import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("EqualAnteProposition", function () {
    let commissioner: Signer, member1: Signer, member2: Signer, nonmember1: Signer;
    let propositionFactory: ContractFactory;
    let proposition: Contract;

    beforeEach(async function () {
        propositionFactory = await ethers.getContractFactory("EqualAnteProposition");
        [commissioner, member1, member2, nonmember1] = await ethers.getSigners();

        const date = Date.now();

        proposition = await propositionFactory.deploy("Test Proposition" + date, date+360, date+720);
        await proposition.connect(commissioner).addMember(await member1.getAddress());
    });

    it("Should allow a member to wager without specifying a value", async function () { 
        proposition.connect(member1)['wager()']();
        expect(await proposition.connect(member1).getMyBet()).to.equal(1);
    });

    it("Should allow a member to wager exactly 1", async function () { 
        proposition.connect(member1)['wager(uint256)'](1);
        expect(await proposition.connect(member1).getMyBet()).to.equal(1);
    });

    it("Should prevent a member from wagering more than 1", async function () { 
        await(expect(proposition.connect(member1)['wager(uint256)'](1000)).to.be.reverted);
    });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });

});