import FungibleToken from "./FungibleToken.cdc"
import DelphaiResources from "./DelphaiResources.cdc"
import BetInterfaces from "./BetInterfaces.cdc"
import CloserInterfaces from "./CloserInterfaces.cdc"
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

    pub resource MintResults {
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

    pub resource interface PublicComposer {
        pub fun getState(): State
        pub fun mintTokens(token: @DelphaiResources.Token): @MintResults
        pub fun placeWager(token: @AnyResource{BetInterfaces.Token})
        pub fun checkClosed()
        pub fun castVote(token: @AnyResource{ResolverInterfaces.Token})
        pub fun resolve()
        pub fun retrievePayout(token: @AnyResource{PayoutInterfaces.Token}): @FungibleToken.Vault
    }

    pub resource BetComposer: PublicComposer {
        priv let betRef: Capability<&AnyResource{BetInterfaces.Bet}>
        priv let closerRef: Capability<&AnyResource{CloserInterfaces.Closer}>
        priv let resolverRef: Capability<&AnyResource{ResolverInterfaces.Resolver}>
        priv let payoutRef: Capability<&AnyResource{PayoutInterfaces.Payout}>

        init (betRef: Capability<&AnyResource{BetInterfaces.Bet}>, 
            closerRef: Capability<&AnyResource{CloserInterfaces.Closer}>,
            resolverRef: Capability<&AnyResource{ResolverInterfaces.Resolver}>, 
            payoutRef: Capability<&AnyResource{PayoutInterfaces.Payout}>) 
        {
            self.betRef = betRef
            self.closerRef = closerRef
            self.resolverRef = resolverRef
            self.payoutRef = payoutRef
        }

        priv fun bet(): &AnyResource{BetInterfaces.Bet} {
            return self.betRef.borrow() ?? panic("Could not borrow bet reference")
        }

        priv fun closer(): &AnyResource{CloserInterfaces.Closer} {
            return self.closerRef.borrow() ?? panic("Could not borrow closer reference")
        }

        priv fun resolver(): &AnyResource{ResolverInterfaces.Resolver} {
            return self.resolverRef.borrow() ?? panic("Could not borrow resolver reference")
        }

        priv fun payout(): &AnyResource{PayoutInterfaces.Payout} {
            return self.payoutRef.borrow() ?? panic("Could not borrow payout reference")
        }

        pub fun getState(): State {
            return State(
                betState: self.bet().state,
                resolverState: self.resolver().state,
                payoutState: self.payout().state
            )
        }

        pub fun mintTokens(token: @DelphaiResources.Token): @MintResults {
            let address = token.address
            let betTokenMintResults <-self.bet().mintToken(token: <-token)
            let betToken <-betTokenMintResults.getToken()
            let payoutMintResults <- self.payout().mintToken(token: <-betTokenMintResults.getDelphaiToken())
            let payoutToken <- payoutMintResults.getToken()
            let resolverMintResults <-self.resolver().mintToken(token: <-payoutMintResults.getDelphaiToken())
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
            let vault <-self.bet().placeWager(token: <-token)
            let isClosed = self.closer().betMade()
            if isClosed {
                self.bet().close()
            }
            self.payout().deposit(from: <-vault)
        }

        pub fun castVote(token: @AnyResource{ResolverInterfaces.Token}) {
            self.resolver().vote(token: <-token)
        }

        pub fun checkClosed() {
            let isClosed = self.closer().checkClosed()
            if isClosed {
                self.bet().close()
            }
        }

        pub fun resolve() {
            let resolution = self.resolver().resolve()
            if resolution == nil {
                return
            }

            let betResolution = self.bet().resolve(resolution: resolution!)

            self.payout().resolve(results: betResolution)
        }

        pub fun retrievePayout(token: @AnyResource{PayoutInterfaces.Token}): @FungibleToken.Vault {
            return <-self.payout().withdraw(token: <-token)
        }
    }

    pub fun create(
        betRef: Capability<&AnyResource{BetInterfaces.Bet}>,
        closerRef: Capability<&AnyResource{CloserInterfaces.Closer}>,
        resolverRef: Capability<&AnyResource{ResolverInterfaces.Resolver}>,
        payoutRef: Capability<&AnyResource{PayoutInterfaces.Payout}>): @BetComposer
    {
        return <-create BetComposer(betRef: betRef, closerRef: closerRef,
            resolverRef: resolverRef, payoutRef: payoutRef)
    }

    pub fun composerPathName(betId: String): String {
        return "Composer_".concat(betId)
    }
}