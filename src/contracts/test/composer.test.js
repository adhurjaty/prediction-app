import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("contract-composer-tests", () => {
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, "../cadence"); 
            // You can specify different port to parallelize execution of describe blocks
        const port = 8080; 
            // Setting logging flag to true will pipe emulator output to console
        const logging = false;
        
        await init(basePath, { port });
        return emulator.start(port, logging);
    });
    
    // Stop emulator, so it could be restarted
    afterEach(async () => {
        return emulator.stop();
    });

    test("deploy bet composer", async () => {
        const delphai = await getAccountAddress("Delphai");
        const [usersResult, usersError] = await deployContractByName({
            to: delphai,
            name: "DelphaiUsers"
        });
        expect(usersError).toBeNull();

        const [betDeployResult, betError] = await deployContractByName({
            to: delphai,
            name: "YesNoBetLibrary",
            addressMap: {
                DelphaiUsers: delphai
            }
        });
        expect(betError).toBeNull();

        const [resolutionDeployResult, resolutionError] = await deployContractByName({
            to: delphai,
            name: "YesNoResolverLibrary",
            addressMap: {
                DelphaiUsers: delphai
            }
        });
        expect(resolutionError).toBeNull();

        const [composerDeployResult, composerError] = await deployContractByName({
            to: delphai,
            name: "BetContractComposer",
            addressMap: {
                DelphaiUsers: delphai,
                YesNoBetLibrary: delphai,
                YesNoResolverLibrary: delphai
            }
        });
        expect(composerError).toBeNull();
    })
});