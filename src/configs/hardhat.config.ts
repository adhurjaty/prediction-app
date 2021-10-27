import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const account = hre.web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await hre.web3.eth.getBalance(account);

    console.log(hre.web3.utils.fromWei(balance, "ether"), "ETH");
  });

task("accounts", "Prints the list of accounts", async (args, hre) => {
      const accounts = await hre.ethers.getSigners();

      for (const account of accounts) {
          console.log(account.address);
  }
});


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // solidity: "0.8.2",
  solidity: "0.7.4",
};
