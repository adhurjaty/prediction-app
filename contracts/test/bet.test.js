import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "@onflow/flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(50000);

describe("bet-contract-test", () => {
    beforeEach(async () => {
        const basePath = path.resolve(__dirname, "../cadence");

        // Setting logging flag to true will pipe emulator output to console
        const logging = false;
        
        await init(basePath);
        return emulator.start({ logging });
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
        await deployContractByName({ to: delphai, name: "DelphaiResources" });
        await deployContractByName({ to: delphai, name: "PayoutInterfaces" });
        await deployContractByName({ to: delphai, name: "WinLosePayout" });
        await deployContractByName({ to: delphai, name: "BetInterfaces" });
        await deployContractByName({ to: delphai, name: "YesNoBet" });
    };

    const setupWinLosePayout = async (delphai, betId) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "test_createWinLosePayout",
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

    const setupDelphaiUsers = async (delphai, users) => {
        for (const user of users) {
            const [result, error] = await shallResolve(
                sendTransaction({
                    name: "setupDelphaiUser",
                    signers: [user],
                    addressMap: {
                        'delphai': delphai,
                    }
                })
            );
    
            expect(error).toBeNull();
        }
    }

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
        await setupDelphaiUsers(delphai, accounts);
        await setupWinLosePayout(delphai, betId);
        await setupYesNoBet(delphai, betId);
        await setupTokenReceivers(delphai, accounts);
        await transferTokens(delphai, betId, accounts);
    }

    const getResults = async (delphai, betId, userResults, outcome) => {
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

        const [resolveResult, resolveError] = await shallResolve(
            sendTransaction({
                name: "test_resolveBet",
                args: [
                    betId,
                    outcome
                ],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        );
        // console.log(resolveResult);
        expect(resolveError).toBeNull();

        const [stateResult, stateError] = await shallResolve(
            executeScript({
                name: "getBetState",
                args: [delphai, betId],
                signers: [userResults[0].account],
                addressMap: { "delphai": delphai }
            })
        );

        expect(stateError).toBeNull();

        for (const user of userResults) {
            const userState = stateResult.wagers[user.account];
            expect(stateResult.isResolved).toBe(true);
            expect(userState).toBeTruthy();
            expect(parseFloat(userState.amount)).toEqual(parseFloat(user.amount));
            expect(userState.bet).toEqual(user.bet);
        }


        const [payoutStateResult, payoutStateError] = await shallResolve(
            executeScript({
                name: "getPayoutState",
                args: [delphai, betId],
                signers: [userResults[0].account],
                addressMap: { "delphai": delphai }
            })
        );
        expect(payoutStateError).toBeNull();

        return payoutStateResult;
    };

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

        const payoutState = await getResults(delphai, betId, users, true);

        const [aliceResult, bobResult, carolResult, danResult] = users
            .map(x => payoutState.payouts[x.account]);
        expect(parseFloat(aliceResult.amount)).toBe(10);
        expect(parseFloat(bobResult.amount)).toBe(18);
        expect(parseFloat(carolResult.amount)).toBe(0);
        expect(parseFloat(danResult.amount)).toBe(0);
    });
});