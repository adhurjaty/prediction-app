require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async taskArgs => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });

task("accounts", "Prints the list of accounts", async () => {
      const accounts = await ethers.getSigners();

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
