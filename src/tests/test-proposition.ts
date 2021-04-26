import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("Proposition", function () {
    let commissioner: Signer, member1: Signer, member2: Signer, nonmember1: Signer;
    let propositionFactory: ContractFactory;
    let proposition: Contract;
    let title: string;

    before(async function () {
        propositionFactory = await ethers.getContractFactory("Proposition");
        [commissioner, member1, member2, nonmember1] = await ethers.getSigners();

        const date = Date.now();
        title = "Test Proposition" + date;

        proposition = await propositionFactory.deploy(title, date+360, date+720);
    });

    it("Should allow anyone to deploy a proposition", async function () { expect.fail("Test not implemented"); });

    it("Should allow anyone to query the proposition title", async function () { 
        expect(await proposition.connect(nonmember1).title()).to.equal(title);
    });

    it("Should allow anyone to query the current pool", async function () { expect.fail("Test not implemented"); });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });

    describe("Commissioner", function () {
        it("Should prevent a commissioner from adding themselves as a member", async function () { 
            expect(await proposition.connect(commissioner).addMember(await commissioner.getAddress())).to.be.reverted;
        });

        it("Should allow a commissioner to add members", async function () { 
            expect.fail("Test not implemented");
        });
        // it("Should ...", async function () { expect.fail("Test not implemented"); });
    });
    
    describe("MembersOnly", function () {
        it("Should allow a member to place a bet", async function () {expect.fail("Test not implemented"); });
        it("Should prevent a non-member from placing a bet", async function () {expect.fail("Test not implemented"); });
        it("Should allow a member to check their bet amount", async function () { expect.fail("Test not implemented"); });
        // it("Should ...", async function () { expect.fail("Test not implemented"); });
    });
});

