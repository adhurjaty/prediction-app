import path from "path";
import { deployContractByName, emulator, executeScript, getAccountAddress, getContractAddress, getFlowBalance, init, mintFlow, sendTransaction, shallPass, shallResolve, shallRevert } from "@onflow/flow-js-testing";

// Increase timeout if your tests failing due to timeout
jest.setTimeout(50000);

describe("resolver-contract-test", () => {
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
        await deployContractByName({ to: delphai, name: "ResolverInterfaces" });
        await deployContractByName({ to: delphai, name: "YesNoResolver" });
    };

    const setupYesNoResolver = async (delphai, betId, numMembers) => {
        const [result, error] = await shallResolve(
            sendTransaction({
                name: "test_createYesNoResolver",
                signers: [delphai],
                args: [betId, numMembers],
                addressMap: {
                    "delphai": delphai
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

    const setupTokenReceivers = async (delphai, users) => {
        for (const user of users) {
            const [result, error] = await shallResolve(
                sendTransaction({
                    name: "setupResolverReceiver",
                    signers: [user],
                    addressMap: {
                        PayoutInterface: delphai,
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
                    name: "test_transferResolverToken",
                    args: [delphai, betId],
                    signers: [user],
                    addressMap: { "delphai": delphai }
                })
            )
            expect(transferError).toBeNull();
        }
    }

    const setupResolver = async (delphai, betId, accounts) => {
        await deployContracts(delphai);
        await setupDelphaiUsers(delphai, accounts);
        await setupYesNoResolver(delphai, betId, accounts.length);
        await setupTokenReceivers(delphai, accounts);
        await transferTokens(delphai, betId, accounts);
    }

    const getResults = async (delphai, betId, users) => {
        const states = [];
        for (const user of users) {
            const [voteResult, voteError] = await shallResolve(
                sendTransaction({
                    name: "test_resolverVote",
                    args: [delphai, betId, user.vote],
                    signers: [user.account],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(voteError).toBeNull();

            const [resolveResult, resolveError] = await shallResolve(
                sendTransaction({
                    name: "test_resolverResolve",
                    args: [betId],
                    signers: [delphai],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(resolveError).toBeNull();

            const [stateResult, stateError] = await shallResolve(
                executeScript({
                    name: "getResolverState",
                    args: [delphai, betId],
                    signers: [user.account],
                    addressMap: { "delphai": delphai }
                })
            );
            expect(stateError).toBeNull();
            states.push(stateResult);
        }

        return states;
    }

    test("majority resolves to true", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", vote: true },
            { name: "Bob", vote: true },
            { name: "Carol", vote: true },
            { name: "Dan", vote: false }
        ];

        await setupAccounts(users);

        await setupResolver(delphai, betId, users.map(x => x.account));

        const states = await getResults(delphai, betId, users);

        expect(states.map(x => x.isResolved)).toEqual([false, false, true, true]);
        expect(states.map(x => x.result)).toEqual([null, null, true, true]);
        for (const user of users) {
            const userState = states[3].votes[user.account];
            expect(userState.vote).toEqual(user.vote);
        }
    });

    test("majority resolves to false", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", vote: false },
            { name: "Bob", vote: false },
            { name: "Carol", vote: true },
            { name: "Dan", vote: false }
        ];

        await setupAccounts(users);

        await setupResolver(delphai, betId, users.map(x => x.account));

        const states = await getResults(delphai, betId, users);

        expect(states.map(x => x.isResolved)).toEqual([false, false, false, true]);
        expect(states.map(x => x.result)).toEqual([null, null, null, false]);
        for (const user of users) {
            const userState = states[3].votes[user.account];
            expect(userState.vote).toEqual(user.vote);
        }
    });

    test("dead heat resolves ambiguous", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", vote: false },
            { name: "Bob", vote: false },
            { name: "Carol", vote: true },
            { name: "Dan", vote: true }
        ];

        await setupAccounts(users);

        await setupResolver(delphai, betId, users.map(x => x.account));

        const states = await getResults(delphai, betId, users);

        expect(states.map(x => x.isResolved)).toEqual([false, false, false, true]);
        expect(states.map(x => x.result)).toEqual([null, null, null, null]);
        for (const user of users) {
            const userState = states[3].votes[user.account];
            expect(userState.vote).toEqual(user.vote);
        }
    });

    test("no majority resolves ambiguous", async () => {
        const betId = "betId1234";

        const delphai = await getAccountAddress("Delphai");
        await mintFlow(delphai, "10.0");

        const users = [
            { name: "Alice", vote: false },
            { name: "Bob", vote: null },
            { name: "Carol", vote: true },
            { name: "Dan", vote: false }
        ];

        await setupAccounts(users);

        await setupResolver(delphai, betId, users.map(x => x.account));

        const states = await getResults(delphai, betId, users);

        expect(states.map(x => x.isResolved)).toEqual([false, false, false, true]);
        expect(states.map(x => x.result)).toEqual([null, null, null, null]);
        for (const user of users) {
            const userState = states[3].votes[user.account];
            expect(userState.vote).toEqual(user.vote);
        }
    });
});