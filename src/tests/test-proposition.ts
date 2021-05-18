import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("Proposition", function () {
    let commissioner: Signer, newcommissioner: Signer;
    let member1: Signer, member2: Signer, nonmember1: Signer;
    let propositionFactory: ContractFactory;
    let proposition: Contract;
    let title: string;

    before(async function () {
        propositionFactory = await ethers.getContractFactory("Proposition");
        [commissioner, member1, member2, nonmember1, newcommissioner] = await ethers.getSigners();

        const date = Date.now();
        title = "Test Proposition" + date;

        proposition = await propositionFactory.deploy(title, date+360, date+720);
    });

    // it("Should allow anyone to deploy a proposition", async function () { expect.fail("Test not implemented"); });

    it("Should allow anyone to query the proposition title", async function () { 
        expect(await proposition.connect(nonmember1).title()).to.equal(title);
    });

    it("Should allow anyone to query the resolution date", async function () { 
        expect.fail("Test not implemented"); 
    });

    it("Should allow anyone to query the bet closing time", async function () { 
        expect.fail("Test not implemented"); 
    });

    it("Should allow anyone to query the current pool", async function () { expect.fail("Test not implemented"); });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });

    describe("Commissioner", function () {
        it("Should prevent a commissioner from adding themselves as a member", async function () { 
            const commissioner_address = await commissioner.getAddress();
            await expect(proposition.connect(commissioner).addMember(commissioner_address)).to.be.reverted;
        });

        it("Should allow a commissioner to add members", async function () { 
            const member1_address = await member1.getAddress();
            const member2_address = await member2.getAddress();
            await proposition.connect(commissioner).addMember(member1_address);
            await proposition.connect(commissioner).addMember(member2_address);
            expect(await proposition.connect(commissioner).checkMembership(member1_address)).to.equal(true);
            expect(await proposition.connect(commissioner).checkMembership(member2_address)).to.equal(true);
        });

        it("Should prevent a commissioner from wagering", async function () {
            await expect(proposition.connect(commissioner).wager(1000)).to.be.reverted;
        });

        it("Should prevent a member from setting a commissioner", async function () { 
            const member1_address = await member1.getAddress();
            await expect(proposition.connect(member1).setCommissioner(member1_address)).to.be.reverted;
        });

        it("Should prevent a non-member from setting a commissioner", async function () { 
            const nonmember1_address = await nonmember1.getAddress();
            await expect(proposition.connect(nonmember1).setCommissioner(nonmember1_address)).to.be.reverted;
        });

        it("Should prevent a member from being set as commissioner", async function () { 
            expect.fail("Test not implemented"); 
        });

        it("Should allow a commissioner to set a commissioner", async function () { 
            const newcommissioner_address = await newcommissioner.getAddress();
            await expect(proposition.connect(newcommissioner).setCommissioner(newcommissioner_address)).to.be.reverted;
        });

        // it("Should ...", async function () { expect.fail("Test not implemented"); });
    });
    
    describe("MembersOnly", function () {
        it("Should prevent a non-member from placing a bet", async function () {
            await expect(proposition.connect(nonmember1).wager(1000)).to.be.reverted;
        });

        it("Should allow a member to place a bet", async function () {expect.fail("Test not implemented"); });

        it("Should allow a member to check their bet amount", async function () { expect.fail("Test not implemented"); });
        // it("Should ...", async function () { expect.fail("Test not implemented"); });
    });
});

