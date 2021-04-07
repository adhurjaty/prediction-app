const { ethers } = require("ethers");
const fs = require("fs");


async function printAccountBalance(provider, address) {
    balance = await provider.getBalance(address);
    console.log("Account balance:", ethers.utils.formatEther(balance));
}

// TODO: This private key is associated with the first default hardhat 
//       account (0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266)
async function getWalletFromKey(provider, privkey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") {

    let wallet = new ethers.Wallet(privkey, provider);

    console.log(wallet);

    return wallet;
}

async function deployEqualAnteProposition(wallet) {
    // Load contract ABI/interface from compiled solidity (`solc`)
    // {
    //   "contracts":
    //   {
    //     "Proposition.sol:EqualAnteProposition":
    //     {
    //       "abi": [],
    //       "bin": ""
    //     }
    //   }
    // }
    let rawdata = fs.readFileSync("build/contracts/combined.json");
    let eapjson = JSON.parse(rawdata)["contracts"]["Proposition.sol:EqualAnteProposition"];

    const date = Date.now();

    const Proposition = new ethers.ContractFactory(eapjson["abi"], eapjson["bin"], wallet);

    // Deploy the proposition
    const proposition = await Proposition.deploy("Sample EAProp", date+360, date+720);

    console.log("Proposition address:", proposition.address);


    return proposition;
}

async function main() {

    // const account = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    // const privatekey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

    // This call uses a default API key for Alchemy provided by ethers.js,
    // might want to replace it with our own for tracking purposes
    const provider = new ethers.providers.AlchemyProvider("ropsten");

    const wallet = await getWalletFromKey(provider);
    printAccountBalance(provider, wallet.address);

    const proposition = await deployEqualAnteProposition(wallet);
    printAccountBalance(provider, wallet.address);

    // Check on the proposition
    const title = await proposition.title();
    console.log("Proposition title:", title);
    const pool = await proposition.pool();
    console.log("Proposition pool:", pool);

}

if (require.main === module) {
    main();
}