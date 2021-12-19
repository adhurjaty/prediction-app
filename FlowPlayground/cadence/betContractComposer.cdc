import BetsLibrary, ResolverLibrary from 0xf8d6e0586b0a20c7

pub contract BetContractComposer {
    priv let resolver: {ResolverLibrary.YesNoResolver}
    priv let bet: {BetsLibrary.YesNoBet}

    init () {
        self.resolver = ResolverLibrary.MajorityYesNoResolver(numMembers: 5)
        self.bet = BetsLibrary.DummyYesNoBet()
    }

    pub fun makeBet(prediction: Bool) {
        self.bet.makeBet(prediction: prediction)
    }

    pub fun voteToResolve(vote: Bool) {
        self.resolver.vote(vote: vote)
    }

    pub fun getResult(): Bool? {
        return self.resolver.getResult()
    }
}
 