// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
      "Deploying contracts with the account:",
      deployer.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Proposition = await hre.ethers.getContractFactory("EqualAnteProposition");
  const proposition = await Proposition.deploy("Sample EAProp", 222, 888);

  await proposition.deployed();

  console.log("Proposition deployed to:", proposition.address);

  console.log("Wager pool before bet:", await proposition.pool());
  console.log("My current wager:", await proposition.getMyBet());

  await proposition.wager();

  console.log("Wager pool after bet:", await proposition.pool());
  console.log("My new wager:", await proposition.getMyBet());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });