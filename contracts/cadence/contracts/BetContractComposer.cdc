import YesNoBetLibrary from "./YesNoBetLibrary.cdc"
import YesNoResolverLibrary from "./YesNoResolverLibrary.cdc"
import DelphaiUsers from "./DelphaiUsers.cdc"
import FungibleToken from "./FungibleToken.cdc"
import FlowToken from "./FlowToken.cdc"

pub contract BetContractComposer {
    pub let adminStoragePath: StoragePath

    pub struct ComposerState {
        pub let wagers: [YesNoBetLibrary.YesNoBetStruct]
        pub let resolutions: YesNoResolverLibrary.YesNoResolutionStruct
        pub let hubPrediction: Bool?
        pub let result: Bool?

        init (wagers: [YesNoBetLibrary.YesNoBetStruct],
            resolutions: YesNoResolverLibrary.YesNoResolutionStruct,
            hubPrediction: Bool?,
            result: Bool?) 
        {
            self.wagers = wagers
            self.resolutions = resolutions
            self.hubPrediction = hubPrediction
            self.result = result
        }
    }

    pub resource ContractComposer {

        priv let resolver: @AnyResource{YesNoResolverLibrary.YesNoResolver}
        priv let bet: @YesNoBetLibrary.HubAndSpokeBet

        init (numMembers: Int) {
            self.resolver <-YesNoResolverLibrary.createMajorityYesNoResolver(numMembers: numMembers)
            self.bet <-YesNoBetLibrary.createHubAndSpokesBet(numMembers: numMembers)
        }

        pub fun makeBet(bet: @AnyResource{DelphaiUsers.BetToken}) {
            self.bet.makeBet(bet: <-bet)
        }

        pub fun voteToResolve(vote: @AnyResource{DelphaiUsers.ResolutionToken}) {
            self.resolver.vote(vote: <-vote)
            let resolution = self.resolver.getResult()
            if resolution != nil {
                self.bet.resolve(resolution: resolution!)
            }
        }

        pub fun retrieveWinning(claimToken: @DelphaiUsers.ClaimToken): @FungibleToken.Vault {
            return <-self.bet.retrieveWinning(claimToken: <-claimToken)
        }

        pub fun getState(): ComposerState {
            let hubBet = self.bet.getHubBet()
            return ComposerState(
                wagers: self.bet.getWagers(),
                resolutions: self.resolver.getResolutionResults(),
                hubPrediction: hubBet != nil ? hubBet!.prediction : nil,
                result: self.resolver.getResult()
            )
        }

        destroy() {
            destroy self.resolver
            destroy self.bet
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
 