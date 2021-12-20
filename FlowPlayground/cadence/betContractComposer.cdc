import BetsLibrary, ResolverLibrary from 0xf8d6e0586b0a20c7

pub contract BetContractComposer {
    pub resource ContractComposer {

        priv let resolver: @AnyResource{ResolverLibrary.YesNoResolver}
        priv let bet: @AnyResource{BetsLibrary.YesNoBet}

        init () {
            self.resolver <- ResolverLibrary.createMajorityYesNoResolver(numMembers: 5)
            self.bet <- BetsLibrary.createDummyYesNoBet()
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

        destroy() {
            destroy self.resolver
            destroy self.bet
        }
    }

    pub fun createContractComposer(): @ContractComposer {
        return <-create ContractComposer()
    }
}
 