import path from "path";
import {
    deployContractByName,
    emulator,
    executeScript,
    getAccountAddress,
    getContractAddress,
    getFlowBalance,
    getFUSDBalance,
    getServiceAddress,
    init,
    mintFlow,
    mintFUSD,
    sendTransaction,
    shallPass,
    shallResolve,
    shallRevert
} from "flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("yes-no-bets", ()=>{
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, "../cadence"); 
            // You can specify different port to parallelize execution of describe blocks
        const port = 8080; 
            // Setting logging flag to true will pipe emulator output to console
        const logging = true;
        
        await init(basePath, { port });
        return emulator.start(port, logging);
    });
    
    // Stop emulator, so it could be restarted
    afterEach(async () => {
        return emulator.stop();
    });

    test("vault script", async () => {
        // emulator.setLogging(true);
        const delphai = await getAccountAddress("Delphai");
        // const [result, error] = await sendTransaction({
        //     name: "setupFUSDAccount",
        //     signers: [delphai]
        // });

        // expect(error).toBeNull();

        // const [r, e] = await sendTransaction({
        //     name: "setupFUSDAccount",
        //     signers: [delphai]
        // });

        // expect(e).toBeNull();

        const response = await mintFUSD(delphai, "42.0");
        const balance = await getFUSDBalance(delphai);
        console.log(balance);
        // const flowToken = await getContractAddress("FlowToken", true);
        // const fungibleToken = await getContractAddress("FungibleToken", true);
        const serviceAddress = await getServiceAddress()

        // console.log(serviceAddress)

        // const [result, error] = await getFlowBalance(delphai);
        // console.log(result, error);

        const [result2, error2] = await sendTransaction({
            name: "exampleTokenVault",
            signers: [delphai]
        })
        expect(error2).toBeNull();
        console.log(result2);
    });
})
