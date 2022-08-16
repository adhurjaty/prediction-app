import path from "path";
import { deployContract, deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(50000);

describe("payout-contract-tests", () => {
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

    const deployContracts = async (delphai) => {
        await deployContractByName({ to: delphai, name: "PayoutInterfaces" });
        await deployContractByName({ to: delphai, name: "WinLosePayout" });

    };

    const setupWinLosePayout = async (delphai) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createWinLosePayout",
                signers: [delphai],
                args: ["betId1234"],
                addressMap: {
                    PayoutInterface: delphai,
                    WinLosePayout: delphai
                }
            })
        );

        expect(error).toBeNull();
    }

    const setupTokenReceivers = async (delphai, users) => {
        for (const user of users) {
            const [result, error] = await shallResolve(
                sendTransaction({
                    name: "setupPayoutReceiver",
                    signers: [user],
                    addressMap: {
                        PayoutInterface: delphai,
                    }
                })
            );
    
            expect(error).toBeNull();
        }
    }

    test("allocates funds all same amount", async () => {
        const delphai = await getAccountAddress("Delphai");
        const alice = await getAccountAddress("Alice");
        const bob = await getAccountAddress("Bob");
        const carol = await getAccountAddress("Carol");
        const dan = await getAccountAddress("Dan");

        await mintFlow(delphai, "10.0");
        await mintFlow(alice, "10.0");
        await mintFlow(bob, "10.0");
        await mintFlow(carol, "10.0");
        await mintFlow(dan, "10.0");

        await deployContracts(delphai);

        await setupWinLosePayout(delphai);

        await setupTokenReceivers(delphai, [alice, bob, carol, dan]);

        for (const user of [alice, bob, carol, dan]) {
            const [transferResult, transferError] = await shallResolve(
                sendTransaction({
                    name: "test_payoutTransfer",
                    args: ["betId1234", user],
                    signers: [delphai],
                    addressMap: { "PayoutInterfaces": delphai }
                })
            )
            expect(transferError).toBeNull();
        }

        for (const user of [alice, bob, carol, dan]) {
            
            const [depositResult, depositError] = await shallResolve(
                sendTransaction({
                    name: "test_payoutDeposit",
                    args: [delphai, "betId1234", "5.0"],
                    signers: [user],
                    addressMap: { "delphai": delphai }
                })
            );

            expect(depositError).toBeNull();
        }

        const [allocateResult, allocateError] = await shallResolve(
            sendTransaction({
                name: "test_payoutAllocate",
                args: ["betId1234", [alice, bob], ["5.0", "5.0"], [carol, dan], ["5.0", "5.0"]],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        );
        expect(allocateError).toBeNull();

        for (const user of [alice, bob, carol, dan]) {
            const [retreiveResult, retreiveError] = await shallResolve(
                sendTransaction({
                    name: "retrievePayout",
                    args: [delphai, "betId1234"],
                    signers: [user],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(retreiveError).toBeNull();
        }

        const [aliceBalance, bobBalance, carolBalance, danBalance] = await Promise.all(
            [alice, bob, carol, dan].map((user) => getFlowBalance(user)
                .then(x => Math.round(parseFloat(x))))
        )

        expect(aliceBalance).toBe(15);
        expect(bobBalance).toBe(15);
        expect(carolBalance).toBe(5);
        expect(danBalance).toBe(5);
    });
})