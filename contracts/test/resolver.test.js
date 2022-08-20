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
        for (const user of users) {
            const [result, error] = await shallResolve(
                sendTransaction({
                    name: "test_resolverVote",
                    args: [delphai, betId, user.vote],
                    signers: [user.account],
                    addressMap: { "delphai": delphai }
                })
            );

            expect(error).toBeNull();
        }

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

        await getResults(delphai, betId, users);
    });
});