import BetsLibrary, ResolverLibrary from 0xf8d6e0586b0a20c7

pub contract BetContractComposer {
    pub resource ContractComposer {

        priv let resolver: @AnyResource{ResolverLibrary.YesNoResolver}
        priv let bet: @BetsLibrary.DummyYesNoBet

        init (numMembers: UInt) {
            self.resolver <- ResolverLibrary.createMajorityYesNoResolver(numMembers: numMembers)
            self.bet <- BetsLibrary.createDummyYesNoBet(numMembers: numMembers)
        }

        pub fun makeBet(acct: AuthAccount, bet: @BetsLibrary.YesNoBet) {
            self.bet.makeBet(acct: acct, bet: <-bet)
        }

        access(account) fun withdrawBet(): @BetsLibrary.YesNoBet {
            return <-self.bet.withdrawBet()
        }

        pub fun voteToResolve(vote: @ResolverLibrary.YesNoVote) {
            self.resolver.vote(vote: <-vote)
        }

        pub fun getResult(): Bool? {
            return self.resolver.getResult()
        }

        destroy() {
            destroy self.resolver
            destroy self.bet
        }
    }

    pub resource Administrator {

        init() {

        }

        pub fun createContractComposer(numMembers: UInt): @ContractComposer {
            return <-create ContractComposer(numMembers: numMembers)
        }
    }

    pub init() {
        self.account.save(<-create Administrator(), to: /storage/composerAdmin)
    }
}
 