import { ethers } from "hardhat";
import { Signer, ContractFactory, Contract } from "ethers";
import { expect } from "chai";

describe("Resolution by vote", function () {
    let commissioner: Signer, member1: Signer, member2: Signer, nonmember1: Signer;
    let propositionFactory: ContractFactory, resolutionFactory: ContractFactory;
    let proposition: Contract, resolution: Contract;
    let title: string;

    before(async function () {
        propositionFactory = await ethers.getContractFactory("EqualAnteProposition");
        resolutionFactory = await ethers.getContractFactory("ResolutionByVote"); 
        [commissioner, member1, member2, nonmember1] = await ethers.getSigners();
    });

    beforeEach(async function () {
        const date = Date.now();
        title = "Test Proposition" + date;

        proposition = await propositionFactory.deploy(title, date+360, date+720);
        resolution = await resolutionFactory.deploy(proposition.address);

        await proposition.connect(commissioner).addMember(member1);
        await proposition.connect(commissioner).addMember(member2);
        await resolution.connect(commissioner).addMember(member1);
        await resolution.connect(commissioner).addMember(member2);
    });
    
    it("Should allow group members to resolve a proposition through vote", async function () { 
        resolution.connect(member1).vote();
        
        expect.fail("Test not completed"); 
    });

    it("Should disallow non-group members to interact with a resolution", async function () { expect.fail("Test not implemented"); });
    it("Should disallow a non-participant in the bet to vote on resolving", async function () { expect.fail("Test not implemented"); });
    it("Should time out a resolution vote after a set period of time", async function () { expect.fail("Test not implemented"); });
    it("Should distribute proposition winnings equally among winners of the proposition", async function () { expect.fail("Test not implemented"); });
    // it("Should ...", async function () { expect.fail("Test not implemented"); });
});