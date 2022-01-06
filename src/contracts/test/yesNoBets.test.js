import path from "path";
import { deployContractByName, emulator, getAccountAddress, init, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

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
        const [deployResult, error] = await deployContractByName({
            to: delphai,
            name: "YesNoBetLibrary"
        });
        console.log(deployResult, error);
        expect(error).toBeNull();
    });

    test("deposit and withdraw yes no bet token", async () => {
        const delphai = await getAccountAddress("Delphai");
        const [deployResult, error] = await deployContractByName({
            to: delphai,
            name: "YesNoBetLibrary"
        });

        const member = await getAccountAddress("member");
        const [saveResult, error2] = await shallResolve(
            sendTransaction({
                name: "saveYesNoBetVault",
                signers: [member],
                addressMap: { "delphai": delphai }
            })
        );
        expect(error2).toBeNull();

        const [transferResult, error3] = await shallResolve(
            sendTransaction({
                name: "transferToken",
                args: ["betId1234", member],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        )
        expect(error3).toBeNull();
    });

    // test("create composer library", async () => {
    //     const delphai = await getAccountAddress("Delphai");
    //     const [deployResult, error] = await deployContractByName({
    //         to: delphai,
    //         name: "BetContractComposer"
    //     });
    //     console.log(deployResult, error);
    // });

    // test("place bets from different users", async () => {
    //     const admin = await getAccountAddress("delphai");
    //     const initMember = await getAccountAddress("initMember");
    //     const otherMember = await getAccountAddress("otherMember");
    //     const nonMember = await getAccountAddress("nonMember");

    //     const [deployResult, error] = await deployContractByName({
    //         to: admin,
    //         name: "BetContractComposer"
    //     });

    //     const [tx, error1] = await shallResolve(
    //         sendTransaction({
    //             name: "createBetResource",
    //             args: ["betId1234", [initMember, otherMember]],
    //             signers: [admin],
    //             addressMap: { "delphai": admin }
    //         }));
    //     console.log(tx, error1);

    //     const [tx2, error2] = await shallResolve(
    //         sendTransaction({
    //             name: "placeBet",
    //             args: ["betId1234", true, 20],
    //             signers: [admin, initMember],
    //             addressMap: { "delphai": admin }
    //         }));
    //     console.log(tx2, error2);

    //     const [tx3, error3] = await shallResolve(
    //         sendTransaction({
    //             name: "placeBet",
    //             args: ["betId1234", false, 20],
    //             signers: [admin, otherMember],
    //             addressMap: { "delphai": admin }
    //         }));
    //     console.log(tx3, error3);

    //     const result = await shallRevert(
    //         sendTransaction({
    //             name: "placeBet",
    //             args: ["betId1234", true, 20],
    //             signers: [admin, otherMember],
    //             addressMap: { "delphai": admin }
    //         }));
    //     console.log(result)
    // });
})
