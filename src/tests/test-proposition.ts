import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("Proposition", function () {
    let commissioner: Signer, member1: Signer, member2: Signer, nonmember1: Signer;
    let propositionFactory: ContractFactory;
    let proposition: Contract;

    before(async function () {
        propositionFactory = await ethers.getContractFactory("Proposition");
        [commissioner, member1, member2, nonmember1] = await ethers.getSigners();

        const date = Date.now();

        proposition = await propositionFactory.deploy("Test Proposition" + date, date+360, date+720);
    });

    it("Should deploy a proposition", async function () { });
    it("Should allow someone to query the title", async function () { });
    it("Should allow someone to query the current pool", async function () { });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });

    describe("Commissioner", function () {
        it("Should prevent a commissioner from adding themselves as a member", async function () { 
            await(expect(proposition.connect(commissioner).addMember(commissioner)).to.be.reverted);
        });
        it("Should allow a commissioner to add members", async function () { 
            expect.fail("Test not implemented");
        });
        // it("Should ...", async function () { expect.fail("Test not implemented"); });
    });
    
    describe("MembersOnly", function () {
        it("Should allow a member to place a bet", async function () {});
        it("Should prevent a non-member from placing a bet", async function () {});
        it("Should allow a member to check their bet amount", async function () { });
        // it("Should ...", async function () { expect.fail("Test not implemented"); });
    });
});

