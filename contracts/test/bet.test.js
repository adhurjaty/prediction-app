import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(10000);

describe("bet-contract-test", () => {
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


    const setupAccounts = async (users) => {
        for (const user of users) {
            const acct = await getAccountAddress(user.name);
            await mintFlow(acct, user.amount);
            user.account = acct;
        }
        return users;
    }

    const deployContracts = async (delphai) => {
        await deployContractByName({ to: delphai, name: "PayoutInterfaces" });
        await deployContractByName({ to: delphai, name: "WinLosePayout" });
        await deployContractByName({ to: delphai, name: "BetInterfaces" });
        await deployContractByName({ to: delphai, name: "YesNoBet" });
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

    const getResults = async (delphai, betId, userResults) => {
        for (const user of userResults) {
            const [wagerResult, wagerError] = await shallResolve(
                sendTransaction({
                    name: "test_betPlaceWager",
                    args: [delphai, betId, user.bet, user.amount],
                    signers: [user.account],
                    addressMap: { "delphai": delphai }
                })
            );

            expect(wagerError).toBeNull();
        }

        // const [winners, losers] = partition(
        //     [...userResults].sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount)),
        //     (result) => result.win
        // );

        // const [allocateResult, allocateError] = await shallResolve(
        //     sendTransaction({
        //         name: "test_payoutAllocate",
        //         args: [
        //             betId,
        //             winners.map(x => x.account),
        //             winners.map(x => x.amount),
        //             losers.map(x => x.account),
        //             losers.map(x => x.amount)
        //         ],
        //         signers: [delphai],
        //         addressMap: { "delphai": delphai }
        //     })
        // );
        // expect(allocateError).toBeNull();

        // for (const user of userResults.map(x => x.account)) {
        //     const [retreiveResult, retreiveError] = await shallResolve(
        //         sendTransaction({
        //             name: "retrievePayout",
        //             args: [delphai, betId],
        //             signers: [user],
        //             addressMap: { "delphai": delphai }
        //         })
        //     );
        //     expect(retreiveError).toBeNull();
        // }


        // return await Promise.all(
        //     userResults.map((user) => getFlowBalance(user.account)
        //         .then(x => Math.round(parseFloat(x) * 10) / 10))
        // )
    };


    const setupYesNoBet = async (delphai, betId) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createYesNoBet",
                signers: [delphai],
                args: [betId],
                addressMap: {
                    YesNoBet: delphai,
                    BetInterfaces: delphai,
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
                    name: "setupBetReceiver",
                    signers: [user],
                    addressMap: {
                        BetInterfaces: delphai,
                    }
                })
            );
    
            expect(error).toBeNull();
        }
    }

    const transferTokens = async (delphai, betId, users) => {
        for (const user of users) {
            const [transferResult, transferError] = await shallResolve(
                sendTransaction({
                    name: "transferBetToken",
                    args: [betId, user],
                    signers: [delphai],
                    addressMap: { "BetInterfaces": delphai }
                })
            )
            expect(transferError).toBeNull();
        }
    }

    const setupBet = async (delphai, betId, accounts) => {
        await deployContracts(delphai);
        await setupWinLosePayout(delphai, betId);
        await setupYesNoBet(delphai, betId);
        await setupTokenReceivers(delphai, accounts);
        await transferTokens(delphai, betId, accounts);
    }

    test("get accurate bet state", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "5.0", bet: true },
            { name: "Bob", amount: "10.0", bet: true },
            { name: "Carol", amount: "6.0", bet: false },
            { name: "Dan", amount: "7.0", bet: false }
        ];

        await setupAccounts(users);

        await setupBet(delphai, betId, users.map(x => x.account));

        await getResults(delphai, betId, users);
    });
});