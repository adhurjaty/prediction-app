import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getFlowBalance, init, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

const deployContracts = async (delphai) => {
    await deployContractByName({
        to: delphai,
        name: "DelphaiUsers"
    });

    await deployContractByName({
        to: delphai,
        name: "YesNoBetLibrary",
        addressMap: {
            DelphaiUsers: delphai
        }
    });

    await deployContractByName({
        to: delphai,
        name: "YesNoResolverLibrary",
        addressMap: {
            DelphaiUsers: delphai
        }
    });
};

const setupAccounts = async (delphai, members) => {
    for (const member of members) {
        await shallResolve(
            sendTransaction({
                name: "saveDelphaiUser",
                signers: [member],
                addressMap: { "delphai": delphai }
            })
        );
    }

    await shallResolve(
        sendTransaction({
            name: "transferTokens",
            args: ["betId1234", members],
            signers: [delphai],
            addressMap: { "delphai": delphai }
        })
    );
};

describe("yes-no-resolver", ()=>{
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

    test("deploy resolver library", async () => {
        const delphai = await getAccountAddress("Delphai");

        const [usersResult, usersError] = await deployContractByName({
            to: delphai,
            name: "DelphaiUsers"
        });
        expect(usersError).toBeNull();

        const [deployResult, error] = await deployContractByName({
            to: delphai,
            name: "YesNoResolverLibrary",
            addressMap: {
                DelphaiUsers: delphai
            }
        });
        expect(error).toBeNull();
    });

    test("deposit yes no bet token", async () => {
        const delphai = await getAccountAddress("Delphai");
        
        const [usersResult, usersError] = await deployContractByName({
            to: delphai,
            name: "DelphaiUsers"
        });
        expect(usersError).toBeNull();

        const [deployResult, error] = await deployContractByName({
            to: delphai,
            name: "YesNoResolverLibrary",
            addressMap: {
                DelphaiUsers: delphai
            }
        });
        expect(error).toBeNull();

        const member = await getAccountAddress("member");
        const [saveResult, error2] = await shallResolve(
            sendTransaction({
                name: "saveDelphaiUser",
                signers: [member],
                addressMap: { "delphai": delphai }
            })
        );
        expect(error2).toBeNull();

        const [transferResult, error3] = await shallResolve(
            sendTransaction({
                name: "transferResolutionToken",
                args: ["betId1234", [member]],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        )
        expect(error3).toBeNull();
    });

    test("check has resolution token true", async () => {
        const delphai = await getAccountAddress("Delphai");
        const alice = await getAccountAddress("alice");
        
        await deployContracts(delphai);
        await setupAccounts(delphai, [alice]);

        const [result, error] = await shallResolve(
            executeScript({
                name: "hasResolutionToken",
                args: [alice, "betId1234"],
                signers: [alice],
                addressMap: { "delphai": delphai }
            })
        );

        expect(error).toBeNull();
        expect(result).toBe(true);
    });

    test("check has resolution token false", async () => {
        const delphai = await getAccountAddress("Delphai");
        const alice = await getAccountAddress("alice");
        
        await deployContracts(delphai);
        await setupAccounts(delphai, [alice]);

        const [result, error] = await shallResolve(
            executeScript({
                name: "hasResolutionToken",
                args: [alice, "otherBetId"],
                signers: [alice],
                addressMap: { "delphai": delphai }
            })
        );

        expect(error).toBeNull();
        expect(result).toBe(false);
    });
})
