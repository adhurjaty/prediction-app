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
jest.setTimeout(100000);

describe("yes-no-bets", ()=>{
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, "../cadence"); 
            // You can specify different port to parallelize execution of describe blocks
        const port = 8080; 
            // Setting logging flag to true will pipe emulator output to console
        const logging = true;
        
        await init(basePath, { port });
        // return emulator.start(port, logging, { flags: '--contracts' });
    });
    
    // Stop emulator, so it could be restarted
    afterEach(async () => {
        // return emulator.stop();
    });

    test("vault script", async () => {
        const delphai = await getAccountAddress("Delphai");
        
        const [result, error] = await sendTransaction({
            name: "storagePathExample",
            signers: [delphai]
        });

        expect(error).toBeNull();
    });
})
