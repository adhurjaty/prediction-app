import BetsLibrary, ResolverLibrary from 0xf8d6e0586b0a20c7

pub contract BetContractComposer {
    pub resource ContractComposer {

        priv let resolver: @AnyResource{ResolverLibrary.YesNoResolver}
        priv let bet: @AnyResource{BetsLibrary.YesNoBet}

        init (numMembers: Int) {
            self.resolver <- ResolverLibrary.createMajorityYesNoResolver(numMembers: numMembers)
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

    pub fun buildContractComposer(groupAccount: AuthAccount, contractId: String): 
        Capability<&ContractComposer>
    {
        let composer <-create ContractComposer(numMembers: 5)
        
        let storagePath = /storage/ComposerContract123
        let privPath = /private/ComposerContract123

        groupAccount.save(<-composer, to: storagePath)
        return groupAccount.link<&ContractComposer>(privPath, target: storagePath)
            ?? panic("Could not save contract")
    }
}
 