import FungibleToken from "./FungibleToken.cdc"
import DelphaiResources from "./DelphaiResources.cdc"
import BetInterfaces from "./BetInterfaces.cdc"
import PayoutInterfaces from "./PayoutInterfaces.cdc"
import ResolverInterfaces from "./ResolverInterfaces.cdc"

pub contract Composer {
    pub struct State {
        pub let betState: AnyStruct{BetInterfaces.State}
        pub let resolverState: AnyStruct{ResolverInterfaces.State}
        pub let payoutState: PayoutInterfaces.State

        init(betState: AnyStruct{BetInterfaces.State}, resolverState: AnyStruct{ResolverInterfaces.State}, payoutState: PayoutInterfaces.State) {
            self.betState = betState
            self.resolverState = resolverState
            self.payoutState = payoutState
        }
    }

    pub resource MintResults: BetInterfaces.MintResults {
        priv let betToken: @[AnyResource{BetInterfaces.Token}]
        priv let payoutToken: @[AnyResource{PayoutInterfaces.Token}]
        priv let resolverToken: @[AnyResource{ResolverInterfaces.Token}]

        init(betToken: @AnyResource{BetInterfaces.Token}, 
            payoutToken: @AnyResource{PayoutInterfaces.Token}, 
            resolverToken: @AnyResource{ResolverInterfaces.Token}) 
        {
            self.betToken <-[<-betToken]
            self.payoutToken <-[<-payoutToken]
            self.resolverToken <-[<-resolverToken]
        }

        pub fun getBetToken(): @AnyResource{BetInterfaces.Token} {
            return <-self.betToken.remove(at: 0)
        }
        pub fun getResolverToken(): @AnyResource{ResolverInterfaces.Token} {
            return <-self.resolverToken.remove(at: 0)
        }
        pub fun getPayoutToken(): @AnyResource{PayoutInterfaces.Token} {
            return <-self.payoutToken.remove(at: 0)
        }

        destroy () {
            destroy self.betToken
            destroy self.payoutToken
            destroy self.resolverToken
        }
    }

    pub resource ComposerResource {
        priv let state: State
        priv let bet: &AnyResource{BetInterfaces.Bet}
        priv let resolver: &AnyResource{ResolverInterfaces.Resolver}
        priv let payout: &AnyResource{PayoutInterfaces.Payout}

        init (bet: &AnyResource{BetInterfaces.Bet}, resolver: &AnyResource{ResolverInterfaces.Resolver}, payout: &AnyResource{PayoutInterfaces.Payout}) {
            self.state = State(
                betState: bet.state,
                resolverState: resolver.state,
                payoutState: payout.state
            )
            self.bet = bet
            self.resolver = resolver
            self.payout = payout
        }

        pub fun mintTokens(token: @DelphaiResources.Token): @MintResults {
            let address = token.address
            let betTokenMintResults <-self.bet.mintTokens(token: <-token)
            let betToken <-betTokenMintResults.getToken()
            let payoutMintResults <- self.payout.mintToken(token: <-betTokenMintResults.getDelphaiToken())
            let payoutToken <- payoutMintResults.getToken()
            let resolverMintResults <-self.resolver.mintToken(token: <-payoutMintResults.getDelphaiToken())
            let resolverToken <-resolverMintResults.getToken()

            destroy  betTokenMintResults
            destroy payoutMintResults
            destroy  resolverMintResults

            return <-create MintResults(
                betToken: <-betToken,
                payoutToken: <-payoutToken,
                resolverToken: <-resolverToken)
        }

        pub fun placeWager(token: @AnyResource{BetInterfaces.Token}) {
            self.bet.placeWager(token: <-token)
        }

        pub fun castVote(token: @AnyResource{ResolverInterfaces.Token}) {
            self.resolver.vote(token: <-token)
        }

        pub fun resolve() {
            let resolution = self.resolver.resolve()
            if resolution == nil {
                return
            }

            let betResolution = self.bet.resolve(resolution: resolution)

            self.payout.resolve(results: betResolution)
        }

        pub fun retrievePayout(token: @AnyResource{PayoutInterfaces.Token}): @FungibleToken.Vault {
            return <-self.payout.withdraw(token: <-token)
        }
    }
}