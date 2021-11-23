import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("BetAgainstMe", function () {
    let commissioner: Signer, hub: Signer, spoke1: Signer, spoke2: Signer;
    let commissioner_address: string, hub_address: string, spoke1_address: string, spoke2_address: string;
    let betFactory: ContractFactory;
    let bet: Contract;
    let resolverFactory: ContractFactory;
    let resolver: Contract;
    const hubOutcome: string = "Yes";
    const spokeOutcome: string = "No";

    beforeEach(async function () {
        betFactory = await ethers.getContractFactory("BetAgainstMe");
        resolverFactory = await ethers.getContractFactory("ResolverByVote");
        [commissioner, hub, spoke1, spoke2] = await ethers.getSigners();
        commissioner_address = await commissioner.getAddress();
        hub_address = await hub.getAddress();
        spoke1_address = await spoke1.getAddress();
        spoke2_address = await spoke2.getAddress();

        const date = Date.now();

        bet = await betFactory.deploy(
            "Test BetAgainstMe" + date, 
            date+360, 
            date+720,
            hub_address,
            hubOutcome,
            spokeOutcome
        );
        resolver = await resolverFactory.deploy(bet.address);
        await bet.setResolver(resolver.address);

        await resolver.connect(commissioner).addOutcomeOption('Yes');
        await resolver.connect(commissioner).addOutcomeOption('No');

        await bet.connect(commissioner).addMember(hub_address);
        await bet.connect(commissioner).addMember(spoke1_address);
        await bet.connect(commissioner).addMember(spoke2_address);
        await resolver.connect(commissioner).addMember(hub_address);
        await resolver.connect(commissioner).addMember(spoke1_address);
        await resolver.connect(commissioner).addMember(spoke2_address);
    });

    describe("Contract Setup", function() {

        it("Should test the contract setup", async function () { expect.fail("Test not implemented"); });

    });

    describe("Betting", function() {

        beforeEach(async function () {
            bet.connect(hub).wager({value: 100});
            expect(await bet.connect(hub).getMyWager()).to.equal(100);
        });

        it("Should allow the hub to set and then increase their wagered amount", async function () { 
            bet.connect(hub).wager({value: 100});
            expect(await bet.connect(hub).getMyWager()).to.equal(200);
        });

        it("Should allow a spoke to bet up to the available amount", async function () { 
            bet.connect(spoke1).wager({value: 90});
            expect(await bet.connect(spoke1).getMyWager()).to.equal(90);

            bet.connect(spoke2).wager({value: 10});
            expect(await bet.connect(spoke2).getMyWager()).to.equal(10);
        });
        
        it("Should not allow a spoke to bet more than the hub has available", async function () { 
            bet.connect(spoke1).wager({value: 90});
            expect(await bet.connect(spoke1).getMyWager()).to.equal(90);

            await expect(bet.connect(spoke2).wager({value: 11})).to.be.reverted;
        });
    });

    describe("Payment", function() {

        this.beforeEach(async function() {
            bet.connect(hub).wager({value: 100});
            expect(await bet.connect(hub).getMyWager()).to.equal(100);

            bet.connect(spoke1).wager({value: 5});
            expect(await bet.connect(spoke1).getMyWager()).to.equal(5);
            bet.connect(spoke2).wager({value: 10});
            expect(await bet.connect(spoke2).getMyWager()).to.equal(10);
        });

        it("Should pay spokes if hub was wrong", async function () { 
            await expect(resolver.connect(spoke1).voteResolved(spokeOutcome))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(spoke1_address, spokeOutcome, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(spokeOutcome)));
            await expect(resolver.connect(spoke2).voteResolved(spokeOutcome))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(spoke2_address, spokeOutcome, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(spokeOutcome)));

            await expect(resolver.connect(hub).voteResolved(spokeOutcome))
                .to.emit(resolver, 'ResolutionOutcomeReached')
                .withArgs(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(spokeOutcome)));

            await expect(bet.connect(commissioner).pay(spoke1_address, 0))
                .to.emit(bet, 'PayMember')
                .withArgs(hub_address, 10);
            
            await expect(bet.connect(commissioner).pay(spoke2_address, 0))
                .to.emit(bet, 'PayMember')
                .withArgs(hub_address, 20);

            /* TODO: check spoke balances */
        });

        it("Should pay hub if hub was right", async function () { 
            await expect(resolver.connect(spoke1).voteResolved(hubOutcome))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(spoke1_address, hubOutcome, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(hubOutcome)));
            await expect(resolver.connect(spoke2).voteResolved(hubOutcome))
                .to.emit(resolver, 'VoteRecorded')
                .withArgs(spoke2_address, hubOutcome, ethers.utils.keccak256(ethers.utils.toUtf8Bytes(hubOutcome)));

            await expect(resolver.connect(hub).voteResolved(hubOutcome))
                .to.emit(resolver, 'ResolutionOutcomeReached')
                .withArgs(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(hubOutcome)));

            await expect(bet.connect(commissioner).pay(hub_address, 0))
                .to.emit(bet, 'PayMember')
                .withArgs(hub_address, 115);

            /* TODO: check hub balance */
        });

    });

    // it("Should ... ", async function () { expect.fail("Test not implemented"); });

});