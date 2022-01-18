import YesNoBetLibrary from 0xdelphai
import YesNoResolverLibrary from 0xdelphai
import DelphaiUsers from 0xdelphai
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

pub contract BetContractComposer {
    pub let adminStoragePath: StoragePath

    pub resource ContractComposer {

        priv let resolver: @AnyResource{YesNoResolverLibrary.YesNoResolver}
        priv let bet: @YesNoBetLibrary.DummyYesNoBet
        priv let potVault: @FungibleToken.Vault

        init (numMembers: Int) {
            self.resolver <-YesNoResolverLibrary.createMajorityYesNoResolver(numMembers: numMembers)
            self.bet <-YesNoBetLibrary.createDummyYesNoBet(numMembers: numMembers)
            self.potVault <-FlowToken.createEmptyVault()
        }

        pub fun makeBet(bet: @AnyResource{DelphaiUsers.BetToken}) {
            let betVault <-self.bet.makeBet(bet: <-bet)
            self.potVault.deposit(from: <-betVault)
        }

        pub fun voteToResolve(vote: @AnyResource{DelphaiUsers.ResolutionToken}) {
            self.resolver.vote(vote: <-vote)
        }

        pub fun getResult(): Bool? {
            return self.resolver.getResult()
        }

        destroy() {
            destroy self.resolver
            destroy self.bet
            destroy self.potVault
        }
    }

    pub resource Administrator {
        pub fun createContractComposer(numMembers: Int): @ContractComposer {
            return <-create ContractComposer(numMembers: numMembers)
        }
    }

    pub init() {
        self.adminStoragePath = /storage/BetAdmin
        let admin <-create Administrator()
        self.account.save(<-admin, to: self.adminStoragePath)
    }

    // pub fun getDeploymentStoragePath(betId: String): StoragePath {
    //     return /storage/betId1234
    //     // return StoragePath(identifier: betId)
    // }

    // pub fun getDeploymentPublicPath(betId: String): PublicPath {
    //     return /public/betId1234
    //     // return PublicPath(identifier: betId)
    // }

}
 