import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

describe("EqualAnteProposition", function () {
    let accounts: Signer[];

    beforeEach(async function () {
        accounts = await ethers.getSigners();
    });

    it("Should ...", async function () { expect.fail("Test not implemented"); });

});