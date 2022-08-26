import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "@onflow/flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(50000);

describe("composer-contract-test", () => {
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
        await deployContractByName({ to: delphai, name: "CloserInterfaces" });
        await deployContractByName({ to: delphai, name: "AllBetsCloser" });
        await deployContractByName({ to: delphai, name: "ResolverInterfaces" });
        await deployContractByName({ to: delphai, name: "YesNoResolver" });
        await deployContractByName({ to: delphai, name: "Composer" });
    };

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

    const setupPayout = async (delphai, betId) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createWinLosePayout",
                signers: [delphai],
                args: [betId],
                addressMap: {
                    "delphai": delphai
                }
            })
        );

        expect(error).toBeNull();
    }

    const setupBet = async (delphai, betId) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createYesNoBet",
                signers: [delphai],
                args: [betId],
                addressMap: {
                    "delphai": delphai
                }
            })
        );

        expect(error).toBeNull();
    }

    const setupCloser = async (delphai, betId, numMembers) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createAllBetsCloser",
                signers: [delphai],
                args: [betId, numMembers],
                addressMap: {
                    "delphai": delphai
                }
            })
        );

        expect(error).toBeNull();
    }

    const setupResolver = async (delphai, betId, users) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createYesNoResolver",
                signers: [delphai],
                args: [betId, users.length],
                addressMap: {
                    "delphai": delphai
                }
            })
        );

        expect(error).toBeNull();
    }
    const setupComposerResource = async (delphai, betId, users) => {
        await setupPayout(delphai, betId);
        await setupBet(delphai, betId);
        await setupCloser(delphai, betId, users.length)
        await setupResolver(delphai, betId, users);

        const [result, error] = await shallResolve(
            sendTransaction({
                name: "createComposer",
                signers: [delphai],
                args: [betId],
                addressMap: {
                    "delphai": delphai
                }
            })
        );

        expect(error).toBeNull();
    }

    const setupTokenReceivers = async (delphai, users) => {
        for (const user of users) {
            const [betResult, betError] = await shallResolve(
                sendTransaction({
                    name: "setupBetReceiver",
                    signers: [user],
                    addressMap: { delphai }
                })
            );
            expect(betError).toBeNull();

            const [resolverResult, resolverError] = await shallResolve(
                sendTransaction({
                    name: "setupResolverReceiver",
                    signers: [user],
                    addressMap: { delphai }
                })
            );
            expect(resolverError).toBeNull();

            const [payoutResult, payoutError] = await shallResolve(
                sendTransaction({
                    name: "setupPayoutReceiver",
                    signers: [user],
                    addressMap: { delphai }
                })
            );
            expect(payoutError).toBeNull();
        }
    }

    const transferTokens = async (delphai, betId, users) => {
        for (const user of users) {
            const [transferResult, transferError] = await shallResolve(
                sendTransaction({
                    name: "transferTokens",
                    args: [delphai, betId],
                    signers: [user],
                    addressMap: { "delphai": delphai }
                })
            )
            expect(transferError).toBeNull();
        }
    }

    const setupComposer = async (delphai, betId, accounts) => {
        await deployContracts(delphai);
        await setupDelphaiUsers(delphai, accounts);
        await setupComposerResource(delphai, betId, accounts);
        await setupTokenReceivers(delphai, accounts);
        await transferTokens(delphai, betId, accounts);
    }

    const getResults = async (delphai, betId, users) => {
        for (const user of users) {
            const [wagerResult, wagerError] = await shallResolve(
                sendTransaction({
                    name: "placeWager",
                    args: [delphai, betId, user.bet, user.amount],
                    signers: [user.account],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(wagerError).toBeNull();
        }

        for (const user of users) {
            const [voteResult, voteError] = await shallResolve(
                sendTransaction({
                    name: "voteToResolve",
                    args: [delphai, betId, user.vote],
                    signers: [user.account],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(voteError).toBeNull();
        }

        const [resolveResult, resolveError] = await shallResolve(
            sendTransaction({
                name: "resolve",
                args: [betId],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        );
        expect(resolveError).toBeNull();

        for (const user of users.map(x => x.account)) {
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
            users.map((user) => getFlowBalance(user.account)
                .then(x => Math.round(parseFloat(x) * 10) / 10))
        );
    }

    test("end to end basic", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", amount: "5.0", bet: true, vote: true },
            { name: "Bob", amount: "10.0", bet: true, vote: true },
            { name: "Carol", amount: "6.0", bet: false, vote: true },
            { name: "Dan", amount: "7.0", bet: false, vote: false }
        ]

        await setupAccounts(users);

        await setupComposer(delphai, betId, users.map(x => x.account));

        const [aliceBalance, bobBalance, carolBalance, danBalance] =
            await getResults(delphai, betId, users);

        expect(aliceBalance).toBe(10);
        expect(bobBalance).toBe(18);
        expect(carolBalance).toBe(0);
        expect(danBalance).toBe(0);

        const [stateResult, stateError] = await shallResolve(
            executeScript({
                name: "getComposerState",
                args: [delphai, betId],
                signers: [delphai],
                addressMap: { "delphai": delphai }
            })
        );
        expect(stateError).toBeNull();

        expect(stateResult.betState.isResolved).toBe(true);
        for (const user of users) {
            const userState = stateResult.betState.wagers[user.account];
            expect(userState).toBeTruthy();
            expect(parseFloat(userState.amount)).toEqual(parseFloat(user.amount));
            expect(userState.bet).toEqual(user.bet);
        }

        expect(stateResult.resolverState.isResolved).toBe(true);
        for (const user of users) {
            const userState = stateResult.resolverState.votes[user.account];
            expect(userState).toBeTruthy();
            expect(userState.vote).toEqual(user.vote);
        }

        expect(stateResult.resolverState.isResolved).toBe(true);
        for (const user of users) {
            const userState = stateResult.payoutState.payouts[user.account];
            expect(userState).toBeTruthy();
            expect(userState.hasRetrieved).toEqual(true);
        }
    })
});