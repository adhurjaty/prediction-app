import path from "path";
import { deployContract, deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

function partition(lst, pred) {
    return lst.reduce((acc, x) => {
        acc[pred(x) ? 0 : 1].push(x);
        return acc;
    }, [[], []]);
}

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

    const setupWinLosePayout = async (delphai, betId) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createWinLosePayout",
                signers: [delphai],
                args: [betId],
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

    const transferPayoutTokens = async (delphai, betId, users) => {
        for (const user of users) {
            const [transferResult, transferError] = await shallResolve(
                sendTransaction({
                    name: "test_payoutTransfer",
                    args: [betId, user],
                    signers: [delphai],
                    addressMap: { "PayoutInterfaces": delphai }
                })
            )
            expect(transferError).toBeNull();
        }
    }

    const setupPayout = async (delphai, betId, users) => {
        await deployContracts(delphai);
        await setupWinLosePayout(delphai, betId);
        await setupTokenReceivers(delphai, users);
        await transferPayoutTokens(delphai, betId, users);
    }

    const getResults = async (delphai, betId, userResults) => {
        for (const user of userResults) {
            const [depositResult, depositError] = await shallResolve(
                sendTransaction({
                    name: "test_payoutDeposit",
                    args: [delphai, betId, user.amount],
                    signers: [user.account],
                    addressMap: { "delphai": delphai }
                })
            );

            expect(depositError).toBeNull();
        }

        const [winners, losers] = partition(userResults, (result) => result.win);
        
        const [allocateResult, allocateError] = await shallResolve(
            sendTransaction({
                name: "test_payoutAllocate",
                args: [
                    betId,
                    winners.map(x => x.account),
                    winners.map(x => x.amount),
                    losers.map(x => x.account),
                    losers.map(x => x.amount)
                ],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        );
        expect(allocateError).toBeNull();

        for (const user of userResults.map(x => x.account)) {
            const [retreiveResult, retreiveError] = await shallResolve(
                sendTransaction({
                    name: "retrievePayout",
                    args: [delphai, betId],
                    signers: [user],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(retreiveError).toBeNull();
        }

        return await Promise.all(
            userResults.map((user) => getFlowBalance(user.account)
                .then(x => Math.round(parseFloat(x))))
        )
    };

    test("allocates funds all same amount", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "5.0", win: true },
            { name: "Bob", amount: "5.0", win: true },
            { name: "Carol", amount: "5.0", win: false },
            { name: "Dan", amount: "5.0", win: false }
        ]

        for (const user of users) {
            const acct = await getAccountAddress(user.name);
            await mintFlow(acct, user.amount);
            user.account = acct;
        }
        
        await setupPayout(delphai, betId, users.map(x => x.account));

        const [aliceBalance, bobBalance, carolBalance, danBalance] =
            await getResults(delphai, betId, users);

        expect(aliceBalance).toBe(10);
        expect(bobBalance).toBe(10);
        expect(carolBalance).toBe(0);
        expect(danBalance).toBe(0);
    });
})