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
  let title;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  before(async function () {
    // Get the ContractFactory and Signers here.
    Proposition = await ethers.getContractFactory("Proposition");
    // Proposition = await ethers.getContractFactory("EqualAnteProposition");
    [owner, notamember, member1, ...addrs] = await ethers.getSigners();

    // console.log("My balance:", owner.getMyBalance());

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    proposition = await Proposition.deploy("Will this proposition work?", 0, 0);
    // await proposition.deployed();
    console.log("Proposition deployed to:", proposition.address);
  });

  it("Should allow a member to place a bet", async function() {
    console.log("Title:", await proposition.title());
    console.log("Wager:", await proposition.getMyBet());

    await proposition.connect(owner).wager(1000);
    //  expect('addBet').to.be.calledOnContract(proposition); // not supported by Hardhat
    expect(await proposition.connect(owner).getMyBet()).to.equal(1000);
  });

  it("Should revert a bet from a non-member", async function() {
    await expect(proposition.connect(notamember).wager()).to.be.reverted;
  });

  it("Should allow a member to add another member", async function() {
    member1_address = await member1.getAddress();
    membership = await proposition.connect(owner).checkMembership(member1_address);
    expect(membership).to.equal(false);

    await proposition.connect(owner).addMember(member1_address);

    membership = await proposition.connect(owner).checkMembership(member1_address);
    expect(membership).to.equal(true);
  });
});

describe("EqualAnteProposition", function() {

  let EAProposition;
  let proposition;
  let owner;
  let notamember;
  let member1;
  let addrs;
  let title;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  before(async function () {
    // Get the ContractFactory and Signers here.
    EAProposition = await ethers.getContractFactory("EqualAnteProposition");
    [owner, notamember, member1, ...addrs] = await ethers.getSigners();

    // console.log("My balance:", owner.getMyBalance());

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    proposition = await EAProposition.deploy("Will this equal ante proposition work?", 0, 0);
    // await proposition.deployed();
    console.log("EqualAnteProposition deployed to:", proposition.address);
  });

  it("[BROKEN] Should allow a member to place a bet", async function() {

    // await proposition.connect(owner).pool();
    console.log("Title:", await proposition.title());
    console.log("Wager:", await proposition.getMyBet());

    await proposition.wager();
    // await proposition.wager(1000);
    // await proposition.connect(owner).wager(ethers.BigNumber.from("1000"));
    // await proposition.connect(owner).wager();
    // expect('addBet').to.be.calledOnContract(proposition); // not supported by Hardhat
  });

  it("Should revert a bet from a non-member", async function() {
    // await expect(proposition.connect(notamember).addBet(1000)).to.be.reverted;
    await expect(proposition.connect(notamember).wager()).to.be.reverted;
  });

  it("Should allow a member to add another member", async function() {
    member1_address = await member1.getAddress();
    membership = await proposition.connect(owner).checkMembership(member1_address);
    expect(membership).to.equal(false);

    await proposition.connect(owner).addMember(member1_address);

    membership = await proposition.connect(owner).checkMembership(member1_address);
    expect(membership).to.equal(true);
  });
});
