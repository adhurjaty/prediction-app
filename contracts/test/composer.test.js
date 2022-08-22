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
            const [result, error] = await shallResolve(
                sendTransaction({
                    name: "setupTokenReceivers",
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

    test("end to end", async () => {
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
    })
});