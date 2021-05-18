import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";
import { Address } from "node:cluster";

describe("Resolution by vote", function () {
    let commissioner: Signer;
    let member1: Signer, member2: Signer, member3: Signer, nonmember1: Signer;
    let member1_address: string, member2_address: string, member3_address: string, nonmember1_address: string; 
    let propositionFactory: ContractFactory, resolutionFactory: ContractFactory;
    let proposition: Contract, resolution: Contract;
    let title: string;

    before(async function () {
        propositionFactory = await ethers.getContractFactory("EqualAnteProposition");
        resolutionFactory = await ethers.getContractFactory("ResolutionByVote"); 
        [commissioner, member1, member2, member3, nonmember1] = await ethers.getSigners();

        member1_address = await member1.getAddress();
        member2_address = await member2.getAddress();
        member3_address = await member3.getAddress();
        nonmember1_address = await nonmember1.getAddress();
    });

    beforeEach(async function () {
        const date = Date.now();
        title = "Test Proposition" + date;

        proposition = await propositionFactory.deploy(title, date+360, date+720);
        resolution = await resolutionFactory.deploy(proposition.address);

        await resolution.connect(commissioner).addResultOption('yes');
        await resolution.connect(commissioner).addResultOption('no');

        await proposition.connect(commissioner).addMember(member1_address);
        await proposition.connect(commissioner).addMember(member2_address);
        await proposition.connect(commissioner).addMember(member3_address);
        await resolution.connect(commissioner).addMember(member1_address);
        await resolution.connect(commissioner).addMember(member2_address);
        await resolution.connect(commissioner).addMember(member3_address);
    });
    
    it("Should allow a group member to vote on resolving a proposition", async function () { 
        await expect(resolution.connect(member1).voteResolved('yes'))
            .to.emit(resolution, 'VoteRecorded')
            .withArgs(member1_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));
    });

    it("Should disallow a non-member from vote on resolving a proposition", async function () { 
        await expect(resolution.connect(nonmember1).voteResolved('yes')).to.be.reverted;
    });

    describe("Unanimous agreement on resolution result", function () {

        it("Should allow group members to resolve a proposition through vote", async function () { 
            await expect(resolution.connect(member1).voteResolved('yes'))
                .to.emit(resolution, 'VoteRecorded')
                .withArgs(member1_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));
            await expect(resolution.connect(member2).voteResolved('yes'))
                .to.emit(resolution, 'VoteRecorded')
                .withArgs(member2_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

            await expect(resolution.connect(member3).voteResolved('yes'))
                .to.emit(resolution, 'ResolutionResultReached')
                .withArgs(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

        });

        it("Should require a unanimous result resolution", async function () { 
            await expect(resolution.connect(member1).voteResolved('yes'))
                .to.emit(resolution, 'VoteRecorded')
                .withArgs(member1_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));
            await expect(resolution.connect(member2).voteResolved('yes'))
                .to.emit(resolution, 'VoteRecorded')
                .withArgs(member2_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

            // Dissenting vote
            await expect(resolution.connect(member3).voteResolved('no'))
                .to.emit(resolution, 'ResolutionResultNotReached')
                .withArgs("Unanimous agreement on result needed");

        });

    });


    it("Should disallow a non-participant in the bet to vote on resolving", async function () { expect.fail("Test not implemented"); });
    it("Should time out a resolution vote after a set period of time", async function () { expect.fail("Test not implemented"); });
    it("Should distribute proposition winnings equally among winners of the proposition", async function () { expect.fail("Test not implemented"); });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });
});