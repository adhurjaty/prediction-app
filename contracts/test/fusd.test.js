import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, getFUSDBalance, init, mintFlow, mintFUSD, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";
import { expect } from "chai";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(50000);

describe("contract-composer-tests", () => {
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, "../cadence");
        // You can specify different port to parallelize execution of describe blocks
        const port = 8080;
        // Setting logging flag to true will pipe emulator output to console
        const logging = true;
        
        await init(basePath, { port });
        return emulator.start(port, logging, { flags: '--contracts' });
    });
    
    // Stop emulator, so it could be restarted
    afterEach(async () => {
        return emulator.stop();
    });

    test("mint FUSD", async () => {
        const delphai = await getAccountAddress("Delphai");
        
        const [mintResult, mintError] = await shallResolve(
            sendTransaction({
                name: "mintFUSD",
                signers: [delphai],
                addressMap: { "FUSD": delphai }
            })
        );

        expect(mintError).toBeNull();
        
        let balance = (await getFUSDBalance(delphai))[0];
        expect(parseFloat(balance)).toBe(99999.9);
    })
});