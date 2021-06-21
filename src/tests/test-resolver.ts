import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("Resolver by vote", function () {
    let commissioner: Signer;
    let member1: Signer, member2: Signer, member3: Signer, nonmember1: Signer, notinthebet1: Signer;
    let member1_address: string, member2_address: string, member3_address: string, nonmember1_address: string, notinthebet1_address: string; 
    let betFactory: ContractFactory, resolverFactory: ContractFactory;
    let bet: Contract, resolver: Contract;
    let title: string;

    before(async function () {
        betFactory = await ethers.getContractFactory("EqualAnteBet");
        resolverFactory = await ethers.getContractFactory("ResolverByVote"); 
        [commissioner, member1, member2, member3, nonmember1, notinthebet1] = await ethers.getSigners();

        member1_address = await member1.getAddress();
        member2_address = await member2.getAddress();
        member3_address = await member3.getAddress();
        nonmember1_address = await nonmember1.getAddress();
        notinthebet1_address = await notinthebet1.getAddress();
    });

    beforeEach(async function () {
        const date = Date.now();
        title = "Test Bet" + date;

        bet = await betFactory.deploy(title, date+360, date+720);
        resolver = await resolverFactory.deploy(bet.address);
        await bet.setResolver(resolver.address);

        await resolver.connect(commissioner).addOutcomeOption('yes');
        await resolver.connect(commissioner).addOutcomeOption('no');

        await bet.connect(commissioner).addMember(member1_address);
        await bet.connect(commissioner).addMember(member2_address);
        await bet.connect(commissioner).addMember(member3_address);
        await bet.connect(commissioner).addMember(notinthebet1_address);
        await resolver.connect(commissioner).addMember(member1_address);
        await resolver.connect(commissioner).addMember(member2_address);
        await resolver.connect(commissioner).addMember(member3_address);
        await resolver.connect(commissioner).addMember(notinthebet1_address);

        await expect(bet.connect(member1)["wager()"]()).to.emit(bet, 'Wager');
        await expect(bet.connect(member2)["wager()"]()).to.emit(bet, 'Wager');
        await expect(bet.connect(member3)["wager()"]()).to.emit(bet, 'Wager');
    });
    
    it("Should allow a group member to vote on resolving a bet", async function () { 
        await expect(resolver.connect(member1).voteResolved('yes'))
            .to.emit(resolver, 'VoteRecorded')
            .withArgs(member1_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));
    });

    it("Should disallow a non-member from vote on resolving a bet", async function () { 
        await expect(resolver.connect(nonmember1).voteResolved('yes')).to.be.reverted;
    });

    describe("Unanimous agreement on resolver result", function () {

        it("Should allow group members to resolve a bet through vote", async function () { 
            await expect(resolver.connect(member1).voteResolved('yes'))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(member1_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));
            await expect(resolver.connect(member2).voteResolved('yes'))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(member2_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

            await expect(resolver.connect(member3).voteResolved('yes'))
                .to.emit(resolver, 'ResolutionOutcomeReached')
                .withArgs(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

        });

        it("Should require a unanimous result resolver", async function () { 
            await expect(resolver.connect(member1).voteResolved('yes'))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(member1_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));
            await expect(resolver.connect(member2).voteResolved('yes'))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(member2_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

            // Dissenting vote
            await expect(resolver.connect(member3).voteResolved('no'))
                .to.emit(resolver, 'ResolutionOutcomeNotReached')
                .withArgs("Unanimous agreement on result needed");

        });

        it("Should prevent a non-participant in the bet to vote on resolving", async function () { 
            await expect(resolver.connect(notinthebet1).voteResolved('yes')).to.be.reverted;
        });
    
        it("Should prevent a bettor from voting to resolve a resolved bet", async function () { 
            await expect(resolver.connect(member1).voteResolved('yes'))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(member1_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));
            await expect(resolver.connect(member2).voteResolved('yes'))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(member2_address, 'yes', ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

            await expect(resolver.connect(member3).voteResolved('yes'))
                .to.emit(resolver, 'ResolutionOutcomeReached')
                .withArgs(ethers.utils.keccak256(ethers.utils.toUtf8Bytes('yes')));

            await expect(resolver.connect(member1).voteResolved('yes'))
                .to.be.revertedWith('Bet has been resolved already');
        });
    });


    // Unimplemented tests

    it("Should time out a resolver vote after a set period of time", async function () { expect.fail("Test not implemented"); });
    it("Should distribute bet winnings equally among winners of the bet", async function () { expect.fail("Test not implemented"); });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });
});