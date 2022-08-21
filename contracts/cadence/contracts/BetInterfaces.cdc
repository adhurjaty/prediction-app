import FungibleToken from "./FungibleToken.cdc"
import DelphaiResources from "./DelphaiResources.cdc"
import PayoutInterfaces from "./PayoutInterfaces.cdc"
import ResolverInterfaces from "./ResolverInterfaces.cdc"

pub contract BetInterfaces {
    pub struct interface Wager {
        pub let address: Address
        pub let amount: UFix64
    }

    pub struct interface State {
        pub var isResolved: Bool
        pub let wagers: {String: AnyStruct{Wager}}
    }

    pub resource interface Token {
        pub let betId: String
        pub let address: Address
        pub let wager: @FungibleToken.Vault
    }

    pub resource interface MintResults {
        pub fun getBetToken(): @AnyResource{Token}
        pub fun getResolverToken(): @AnyResource{ResolverInterfaces.Token}
        pub fun getPayoutToken(): @AnyResource{PayoutInterfaces.Token}
    }

    pub resource interface Bet {
        pub let betId: String
        pub let state: AnyStruct{State}

        pub fun mintTokens(token: @DelphaiResources.Token): @AnyResource{MintResults} {
            pre {
                token.betId == self.betId: "Token betId does not match payout betId"
            }
        }

        pub fun placeWager(token: @AnyResource{Token}) {
            pre {
                token.betId == self.betId: "Bet ID does not match"
                token.wager.balance > 0.0: "Wager must be greater than 0"
            }
        }

        pub fun castVote(token: @AnyResource{ResolverInterfaces.Token}) {
            pre {
                token.betId == self.betId: "Bet ID does not match"
            }
        }

        pub fun resolve()

        pub fun retrievePayout(token: @AnyResource{PayoutInterfaces.Token}): @FungibleToken.Vault {
            pre {
                token.betId == self.betId: "Bet ID does not match"
            }
        }
    }

    pub resource interface Receiver {
        pub fun deposit(token: @AnyResource{Token})
    }

    pub resource Vault: Receiver {
        priv let tokens: @{String: AnyResource{Token}}

        init () {
            self.tokens <- {}
        }

        pub fun deposit(token: @AnyResource{Token}) {
            self.tokens[token.betId] <-! token
        }

        pub fun withdraw(betId: String): @AnyResource{Token} {
            return <- (self.tokens.remove(key: betId)
                ?? panic("No token with betId ".concat(betId)))
        }

        destroy () {
            destroy self.tokens
        }
    }

    pub fun createVault(): @Vault {
        return <-create Vault()
    }

    pub fun betPathName(betId: String): String {
        return "Bet_".concat(betId)
    }
}