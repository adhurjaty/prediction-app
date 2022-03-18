// this is a total hack for deploying the necessary contracts for local testing

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

describe("deploy", ()=>{
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, "../cadence"); 

        // emulator should already be running
        // await init(basePath, { port });
        // return emulator.start(port, logging, { flags: '--contracts' });
    });
    
    // Stop emulator, so it could be restarted
    afterEach(async () => {
        // return emulator.stop();
    });

    test("vault script", async () => {
        const delphai = await getAccountAddress("Delphai");
        
        const [result, error] = await sendTransaction({
            name: "exampleTokenVault",
            signers: [delphai]
        });

        expect(error).toBeNull();
    });
})
