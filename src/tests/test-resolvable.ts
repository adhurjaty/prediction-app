import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Resolvable interface", function () {
    let commissioner: SignerWithAddress;
    let member1: SignerWithAddress;
    let member2: SignerWithAddress;
    let member3: SignerWithAddress;
    let nonmember1: SignerWithAddress;
    let notinthebet1: SignerWithAddress;
    let betFactory: ContractFactory, resolverFactory: ContractFactory;
    let bet: Contract, resolver: Contract;
    let title: string;

    before(async function () {
        betFactory = await ethers.getContractFactory("EqualAnteBet");
        resolverFactory = await ethers.getContractFactory("ResolverByVote"); 
        [commissioner, member1, member2, member3, nonmember1, notinthebet1] = await ethers.getSigners();
    });

    beforeEach(async function () {
        const date = Date.now();
        title = "Test Bet" + date;

        bet = await betFactory.deploy(title, date+360, date+720);
        resolver = await resolverFactory.deploy(bet.address);
        await bet.setResolver(resolver.address);

        await resolver.connect(commissioner).addOutcomeOption('yes');
        await resolver.connect(commissioner).addOutcomeOption('no');

        await bet.connect(commissioner).addMember(member1.address);
        await bet.connect(commissioner).addMember(member2.address);
        await bet.connect(commissioner).addMember(member3.address);
        await bet.connect(commissioner).addMember(notinthebet1.address);
        await resolver.connect(commissioner).addMember(member1.address);
        await resolver.connect(commissioner).addMember(member2.address);
        await resolver.connect(commissioner).addMember(member3.address);
        await resolver.connect(commissioner).addMember(notinthebet1.address);

        await expect(bet.connect(member1).wager({value: 1})).to.emit(bet, 'Wager');
        await expect(bet.connect(member2).wager({value: 1})).to.emit(bet, 'Wager');
        await expect(bet.connect(member3).wager({value: 1})).to.emit(bet, 'Wager');
    });

    it("Should not allow anyone other than the commissioner to set the resolver", async function () { 
        await expect(bet.connect(notinthebet1).setResolver(notinthebet1.address)).to.be.reverted;
    });

    it("Should return correct resolution status of bet", async function () { expect.fail("Test not implemented"); });

    // it("Should ... ", async function () { expect.fail("Test not implemented"); });
    // it("Should ... ", async function () { expect.fail("Test not implemented"); });
});