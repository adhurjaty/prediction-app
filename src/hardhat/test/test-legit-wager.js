const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Proposition", function() {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Proposition;
  let proposition;
  let owner;
  let notamember;
  let member1;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Proposition = await ethers.getContractFactory("Proposition");
    [owner, notamember, member1, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    proposition = await Proposition.deploy();
  });

  it("Should allow a member to place a bet (test broken)", async function() {

    await proposition.addBet(1000);
    // expect('addBet').to.be.calledOnContract(proposition); // not supported by Hardhat
  });

  it("Should revert a bet from a non-member", async function() {
    await expect(proposition.connect(notamember).addBet(1000)).to.be.reverted;
  });
});
