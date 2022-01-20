import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, mintFUSD, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

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
    });

    test("full bet and resolution", async () => {
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

        const hub = await getAccountAddress("hub");
        const spoke = await getAccountAddress("spoke");
        await mintFlow(hub, "42.0");
        await mintFlow(spoke, "42.0");

        for (const member of [hub, spoke]) {
            const [saveResult, error2] = await shallResolve(
                sendTransaction({
                    name: "saveDelphaiUser",
                    signers: [member],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(error2).toBeNull();
        }

        const [transferResult, error3] = await shallResolve(
            sendTransaction({
                name: "transferTokens",
                args: ["betId1234", [hub, spoke]],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        )
        expect(error3).toBeNull();

        const [deployComposerResult, deployComposerError] = await shallResolve(
            sendTransaction({
                name: "deployComposerBet",
                args: ["betId1234", 2],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        )
        expect(deployComposerError).toBeNull();

        const [placeHubResult, placeHubError] = await shallResolve(
            sendTransaction({
                name: "placeBetComposer",
                args: [delphai, "betId1234", true, 20],
                signers: [hub],
                addressMap: { "delphai": delphai }
            })
        )
        expect(placeHubError).toBeNull();

        const [placeSpokeResult, placeSpokeError] = await shallResolve(
            sendTransaction({
                name: "placeBetComposer",
                args: [delphai, "betId1234", false, 20],
                signers: [spoke],
                addressMap: { "delphai": delphai }
            })
        )
        expect(placeSpokeError).toBeNull();

        for (const member of [hub, spoke]) {
            const [sendResolutionTokenResult, resTokenError] = await shallResolve(
                sendTransaction({
                    name: "voteToResolve",
                    args: [delphai, "betId1234", true],
                    signers: [member],
                    addressMap: { "delphai": delphai }
                })
            )
            expect(resTokenError).toBeNull();
        }

        for (const member of [hub, spoke]) {
            const [retrieveWinningResult, retrieveWinningError] = await shallResolve(
                sendTransaction({
                    name: "retrieveWinning",
                    args: [delphai, "betId1234"],
                    signers: [member],
                    addressMap: { "delphai": delphai }
                })
            )
            expect(retrieveWinningError).toBeNull();
        }

        let balance = (await getFlowBalance(hub))[0];
        expect(balance).toBe("62.00100000");
    });
});