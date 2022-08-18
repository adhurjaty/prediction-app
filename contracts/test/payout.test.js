import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getFlowBalance, init, mintFlow, sendTransaction, shallResolve } from "flow-js-testing";

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
                    name: "transferPayoutToken",
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

        const [winners, losers] = partition(
            [...userResults].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount)),
            (result) => result.win
        );

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
                .then(x => Math.round(parseFloat(x) * 10) / 10))
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

    test("allocates funds winner bets dominate", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "5.0", win: true },
            { name: "Bob", amount: "10.0", win: true },
            { name: "Carol", amount: "6.0", win: false },
            { name: "Dan", amount: "7.0", win: false }
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
        expect(bobBalance).toBe(18);
        expect(carolBalance).toBe(0);
        expect(danBalance).toBe(0);
    });

    test("allocates funds loser bets dominate", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "4.0", win: true },
            { name: "Bob", amount: "6.0", win: true },
            { name: "Carol", amount: "8.0", win: false },
            { name: "Dan", amount: "7.0", win: false }
        ]

        for (const user of users) {
            const acct = await getAccountAddress(user.name);
            await mintFlow(acct, user.amount);
            user.account = acct;
        }
        
        await setupPayout(delphai, betId, users.map(x => x.account));

        const [aliceBalance, bobBalance, carolBalance, danBalance] =
            await getResults(delphai, betId, users);

        expect(aliceBalance).toBe(8);
        expect(bobBalance).toBe(12);
        expect(carolBalance).toBe(3);
        expect(danBalance).toBe(2);
    });

    test("allocates funds loser bets dominate on zeroed out", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "7.0", win: true },
            { name: "Bob", amount: "6.0", win: true },
            { name: "Carol", amount: "10.0", win: false },
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

        expect(aliceBalance).toBe(14);
        expect(bobBalance).toBe(12);
        expect(carolBalance).toBe(2);
        expect(danBalance).toBe(0);
    });

    test("large test", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "7.0", win: true },
            { name: "Bob", amount: "6.0", win: true },
            { name: "Carol", amount: "10.0", win: false },
            { name: "Dan", amount: "5.0", win: false },
            { name: "Eric", amount: "20.0", win: true },
            { name: "Frannie", amount: "15.0", win: false },
            { name: "Greg", amount: "12.0", win: false },
            { name: "Hank", amount: "3.0", win: true },
        ]

        for (const user of users) {
            const acct = await getAccountAddress(user.name);
            await mintFlow(acct, user.amount);
            user.account = acct;
        }
        
        await setupPayout(delphai, betId, users.map(x => x.account));

        const [
            aliceBalance,
            bobBalance,
            carolBalance,
            danBalance,
            ericBalance,
            frannieBalance,
            gregBalance,
            hankBalance
        ] =
            await getResults(delphai, betId, users);

        expect(aliceBalance).toBe(14);
        expect(bobBalance).toBe(12);
        expect(carolBalance).toBe(0);
        expect(danBalance).toBe(0);
        expect(ericBalance).toBe(40);
        expect(frannieBalance).toBe(4.5);
        expect(gregBalance).toBe(1.5);
        expect(hankBalance).toBe(6);
    });

    test("get payout states", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "4.0", win: true },
            { name: "Bob", amount: "6.0", win: true },
            { name: "Carol", amount: "8.0", win: false },
            { name: "Dan", amount: "7.0", win: false }
        ]

        for (const user of users) {
            const acct = await getAccountAddress(user.name);
            await mintFlow(acct, user.amount);
            user.account = acct;
        }
        
        await setupPayout(delphai, betId, users.map(x => x.account));

        const [setupStateResult, setupStateError] = await shallResolve(
            executeScript({
                name: "getPayoutState",
                args: [delphai, betId],
                signers: [users[0].account],
                addressMap: { "delphai": delphai }
            })
        );
        expect(setupStateError).toBeNull();
        expect(setupStateResult.isResolved).toBe(false);

        const [aliceBalance, bobBalance, carolBalance, danBalance] =
            await getResults(delphai, betId, users);
        
        const [endStateResult, endStateError] = await shallResolve(
            executeScript({
                name: "getPayoutState",
                args: [delphai, betId],
                signers: [users[0].account],
                addressMap: { "delphai": delphai }
            })
        );
        expect(endStateError).toBeNull();
        expect(endStateResult.isResolved).toBe(true);
        
        const [aliceResult, bobResult, carolResult, danResult] = users
            .map(x => endStateResult.payouts[x.account]);
        expect(parseFloat(aliceResult.amount)).toBe(8);
        expect(aliceResult.hasRetrieved).toBe(true);
        expect(parseFloat(bobResult.amount)).toBe(12);
        expect(bobResult.hasRetrieved).toBe(true);
        expect(parseFloat(carolResult.amount)).toBe(3);
        expect(carolResult.hasRetrieved).toBe(true);
        expect(parseFloat(danResult.amount)).toBe(2);
        expect(danResult.hasRetrieved).toBe(true);

        expect(aliceBalance).toBe(8);
        expect(bobBalance).toBe(12);
        expect(carolBalance).toBe(3);
        expect(danBalance).toBe(2);
    });
})