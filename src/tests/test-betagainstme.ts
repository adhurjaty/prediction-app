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

    beforeEach(async function () {
        betFactory = await ethers.getContractFactory("BetAgainstMe");
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
            "Yes",
            "No"
        );

        await bet.connect(commissioner).addMember(hub_address);
        await bet.connect(commissioner).addMember(spoke1_address);
        await bet.connect(commissioner).addMember(spoke2_address);
    });

    describe("Contract Setup", function() {

        it("Should test the contract setup", async function () { expect.fail("Test not implemented"); });

    });

    describe("Betting", function() {
        it("Should allow the hub to set and then increase their wagered amount", async function () { 
            bet.connect(hub).wager({value: 100});
            expect(await bet.connect(hub).getMyWager()).to.equal(100);

            bet.connect(hub).wager({value: 100});
            expect(await bet.connect(hub).getMyWager()).to.equal(200);
        });

        it("Should allow a spoke to bet up to the available amount", async function () { 
            bet.connect(hub).wager({value: 100});
            expect(await bet.connect(hub).getMyWager()).to.equal(100);

            bet.connect(spoke1).wager({value: 90});
            expect(await bet.connect(spoke1).getMyWager()).to.equal(90);

            bet.connect(spoke2).wager({value: 10});
            expect(await bet.connect(spoke2).getMyWager()).to.equal(10);
        });
        
        it("Should not allow a spoke to bet more than the hub has available", async function () { 
            bet.connect(hub).wager({value: 100});
            expect(await bet.connect(hub).getMyWager()).to.equal(100);

            bet.connect(spoke1).wager({value: 90});
            expect(await bet.connect(spoke1).getMyWager()).to.equal(90);

            await expect(bet.connect(spoke2).wager({value: 11})).to.be.reverted;
        });
    });

    describe("Payment", function() {

        it("Should pay spokes if hub was wrong", async function () { expect.fail("Test not implemented"); });
        it("Should pay hub if hub was right", async function () { expect.fail("Test not implemented"); });

    });

    // it("Should ... ", async function () { expect.fail("Test not implemented"); });

});