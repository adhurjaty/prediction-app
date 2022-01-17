import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("yes-no-bets", ()=>{
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

    test("deploy bet library", async () => {
        const delphai = await getAccountAddress("Delphai");
        const [usersResult, usersError] = await deployContractByName({
            to: delphai,
            name: "DelphaiUsers"
        });
        expect(usersError).toBeNull();

        const [deployResult, error] = await deployContractByName({
            to: delphai,
            name: "YesNoBetLibrary",
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
            name: "YesNoBetLibrary",
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
                name: "transferToken",
                args: ["betId1234", [member]],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        )
        expect(error3).toBeNull();
    });

    // test("cache tokens if no receiver vault exists", async () => {
    //     const delphai = await getAccountAddress("Delphai");
    //     const fungibleToken = await getContractAddress("FungibleToken", true);
    //     const [deployResult, error] = await deployContractByName({
    //         to: delphai,
    //         name: "YesNoBetLibrary",
    //         addressMap: { FungibleToken: fungibleToken }
    //     });

    //     const member = await getAccountAddress("member");
    //     const [saveResult, error2] = await shallResolve(
    //         sendTransaction({
    //             name: "saveYesNoBetVault",
    //             signers: [member],
    //             addressMap: { "delphai": delphai }
    //         })
    //     );
    //     expect(error2).toBeNull();

    //     const member2 = await getAccountAddress("member2");

    //     const [transferResult, error3] = await shallResolve(
    //         sendTransaction({
    //             name: "transferToken",
    //             args: ["betId1234", [member, member2]],
    //             signers: [delphai],
    //             addressMap: { "delphai": delphai }
    //         })
    //     )
    //     expect(error3).toBeNull();
    // });

    // test("place simple bet", async () => {
    //     const delphai = await getAccountAddress("Delphai");
    //     const flowToken = await getContractAddress("FlowToken", true);
    //     const fungibleToken = await getContractAddress("FungibleToken", true);
    //     const [deployResult, error] = await deployContractByName({
    //         to: delphai,
    //         name: "YesNoBetLibrary",
    //         addressMap: { FungibleToken: fungibleToken }
    //     });
        
    //     const member = await getAccountAddress("member");
    //     const [saveResult, error2] = await shallResolve(
    //         sendTransaction({
    //             name: "saveYesNoBetVault",
    //             signers: [member],
    //             addressMap: { "delphai": delphai }
    //         })
    //     );
    //     expect(error2).toBeNull();

    //     const [transferResult, error3] = await shallResolve(
    //         sendTransaction({
    //             name: "transferToken",
    //             args: ["betId1234", [member]],
    //             signers: [delphai],
    //             addressMap: { "delphai": delphai }
    //         })
    //     )
    //     expect(error3).toBeNull();

    //     await mintFlow(member, "42.0");
    //     const [placeBetResult, placeBetError] = await shallResolve(
    //         sendTransaction({
    //             name: "placeBet",
    //             signers: [member],
    //             args: ["bet1234", true, 20],
    //             addressMap: {
    //                 delphai: delphai,
    //                 FlowToken: flowToken
    //             }
    //         })
    //     );
    //     expect(placeBetError).toBeNull();
    //     expect(placeBetResult.events[1].data.status).toBe("Bet made");
    // });
})
