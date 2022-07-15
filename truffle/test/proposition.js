const { expect } = require("chai");

const Proposition = artifacts.require('Proposition');


contract('Proposition', addresses => {
    const [admin, user1, user2, user3, _] = addresses;

    it('places bet', async () => {
        const proposition = await Proposition.new();
        await proposition.addMember(user1, {from: admin})
        await proposition.addMember(user2, {from: user1})
        await proposition.addMember(user3, {from: user1})

        await proposition.addBet(20, {from: user1});
        await proposition.addBet(10, {from: user2});

        const user1Wager = await proposition.getMyWager({from: user1});
        const user2Wager = await proposition.getMyWager({from: user2});

        assert(user1Wager == 20);
        assert(user2Wager == 10);
    });

    it('doesn\'t allow non-members to bet', async () => {
        const proposition = await Proposition.new();
        
        try {
            await proposition.addBet(20, {from: user1});
            assert(false);
        } catch(e) {
            expect(e).to.be.instanceof(Error);
            expect(e.message).to.eql('Returned error: VM Exception while processing transaction: revert Caller is not a member -- Reason given: Caller is not a member.');
        }
    });
})  